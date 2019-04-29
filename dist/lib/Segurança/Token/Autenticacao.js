"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passport_jwt_1 = require("passport-jwt");
const HttpStatus = require("http-status");
const Criptografia_1 = require("../Criptografia");
const jwt = require("jwt-simple");
class Autenticacao {
    constructor() {
        /**
         * Gera um JWT de acordo com o conteúdo passado
         * @param conteudoToken <Object> Objeto com os dados a serem criptografados no Token
         * @param chaveCriptografia <string> Chave a ser usada para descriptografar este Token caso necessário
         * @returns Promise<string>
         */
        this.gerarToken = (conteudoToken, chaveCriptografia) => __awaiter(this, void 0, void 0, function* () {
            return yield jwt.encode(conteudoToken, chaveCriptografia);
        });
    }
    /**
     *
     * @param req <Request> (express)
     * @param res <Response> (express)
     */
    falhaAutenticacao(req, res) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    /**
     * Retorna o token gerado no corpo da resposta
     * @param res <Response> (express)
     * @param senha <string> Senha a ser verificada(descriptografada)
     * @param usuario <any> Dados do usuário que está tentando se autenticar no sistema (deve conter as propriedades id e senha)
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @returns <Response> (express)
     */
    sucessoAutenticacao(res, senha, usuario, chaveCriptografia) {
        if (Criptografia_1.default.senhaConfere(senha, usuario.senha))
            res.json({
                token: this.gerarToken({ id: usuario.id }, chaveCriptografia)
            });
        else
            res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    /**
     * Configura a estratégia de autenticação da API
     * @param servico <any> Classe que extenda Servico<T>
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @returns <Object> Objeto com métodos de inicialização e autenticação da estratégia de validação de Token da API
     */
    configurar(servico, chaveCriptografia) {
        let opts = {
            secretOrKey: chaveCriptografia,
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('jwt')
        };
        /** Service passado deve obrigatoriamente ter o método findById */
        passport.use(new passport_jwt_1.Strategy(opts, (jwtPayload, done) => {
            servico.findById(jwtPayload.id).then(user => {
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
        };
    }
}
exports.default = new Autenticacao();
