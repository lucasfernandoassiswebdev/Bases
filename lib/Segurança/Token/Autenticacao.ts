import { Strategy, ExtractJwt } from 'passport-jwt';
import HttpStatus from 'http-status';
import { Request, Response } from 'express';
import Criptografia from '../Criptografia';
import * as jwt from 'jwt-simple';

class Autenticacao {

    /**
     * 
     * @param req <Request> (express)
     * @param res <Response> (express)
     */
    public falhaAutenticacao(req: Request, res: Response): void {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    /**
     * 
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param mensagem <string> Mensagem do corpo da resposta
     */
    public autenticacaoIrregular(req: Request, res: Response, message: String): void {
        res.status(HttpStatus.UNAUTHORIZED).json({
            mensagem: message
        });
    }

    /**
     * Gera um JWT de acordo com o conteúdo passado
     * @param conteudoToken <Object> Objeto com os dados a serem criptografados no Token
     * @param chaveCriptografia <string> Chave a ser usada para descriptografar este Token caso necessário 
     * @returns Promise<string>
     */
    public gerarToken = async (conteudoToken: Object, chaveCriptografia: string): Promise<string> => {
        return await jwt.encode(conteudoToken, chaveCriptografia);
    }

    /**
     * Retorna o token gerado no corpo da resposta
     * @param res <Response> (express)
     * @param senha <string> Senha a ser verificada(descriptografada)
     * @param usuario <any> Dados do usuário que está tentando se autenticar no sistema (deve conter as propriedades id e senha)
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @param paramName <string> propriedade que identifica o usuário, default -> id
     * @returns <Response> (express)
     */
    public async sucessoAutenticacao(res: Response, senha: string, usuario: any, chaveCriptografia: string, paramName?: string) {
        if (await Criptografia.hashConfere(usuario.senha, senha)) {
            delete usuario.senha;

            res.json({
                token: await this.gerarToken({ id: (paramName != undefined && paramName.length > 0) ? usuario[paramName] : usuario.id }, chaveCriptografia),
                usuario: usuario
            });
        } else
            res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    /**
     * Configura a estratégia de autenticação da API
     * @param servico <any> Classe que extenda Servico<T>, deve conter o método "buscarPorId"
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @returns <Object> Objeto com métodos de inicialização e autenticação da estratégia de validação de Token da API
     */
    public configurar(passport: any, servico: any, chaveCriptografia: string): any {
        let opts = {
            secretOrKey: chaveCriptografia,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
        };

        /** Service passado deve obrigatoriamente ter o método buscarPorId */
        passport.use(new Strategy(opts, (jwtPayload, done) => {
            servico.buscarPorId(jwtPayload.id).then((user: any) => {
                if (user)
                    return done(null, user);

                return done(null, false);
            }).catch((error: any) => {
                done(error, null);
            });
        }));

        return {
            iniciar: () => passport.initialize(),
            autenticar: () => passport.authenticate('jwt', { session: false })
        }
    }
}

export default new Autenticacao();
