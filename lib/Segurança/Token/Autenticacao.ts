import * as passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as HttpStatus from 'http-status';
import { Request, Response } from 'express';
import Criptografia from '../Criptografia';
import * as jwt from 'jwt-simple';

export default class Autenticacao {

    /**
     * 
     * @param req <Request> (express)
     * @param res <Response> (express)
     */
    public falhaAutenticacao(req: Request, res: Response): void {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
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
     * @returns <Response> (express)
     */
    public async sucessoAutenticacao(res: Response, senha: string, usuario: any, chaveCriptografia: string) {        
        if (Criptografia.senhaConfere(senha, usuario.senha))
            res.json({
                token: await this.gerarToken({ id: usuario.id }, chaveCriptografia)
            });
        else
            res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    /**
     * Configura a estratégia de autenticação da API
     * @param servico <any> Classe que extenda Servico<T>, deve conter o método "buscarPorId"
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @returns <Object> Objeto com métodos de inicialização e autenticação da estratégia de validação de Token da API
     */
    public configurar(servico: any, chaveCriptografia: string): any {
        let opts = {
            secretOrKey: chaveCriptografia,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
        };

        /** Service passado deve obrigatoriamente ter o método buscarPorId */
        passport.use(new Strategy(opts, (jwtPayload, done) => {
            servico.buscarPorId(jwtPayload.id).then(user => {
                if (user) {
                    return done(null, {
                        id: user.id,
                        email: user.email
                    });
                }

                return done(null, false);
            }).catch(error => {
                done(error, null);
            });
        }));

        return {
            iniciar: () => passport.initialize(),
            autenticar: () => passport.authenticate('jwt', { session: false })
        }
    }
}
