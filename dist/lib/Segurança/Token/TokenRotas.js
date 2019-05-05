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
const _ = require("lodash");
const Autenticacao_1 = require("./Autenticacao");
class TokenRotas {
    constructor() {
        /**
         *
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @param servico <any> Classe que extenda Servico<T>
         * @returns <Response> (express)
         */
        this.auth = (req, res, servico) => __awaiter(this, void 0, void 0, function* () {
            const credenciais = {
                email: req.body.email,
                password: req.body.password
            };
            if (credenciais.email) {
                yield servico.buscarPorEmail(credenciais.email)
                    .then(_.partial(Autenticacao_1.default.sucessoAutenticacao, res, credenciais))
                    .catch(_.partial(Autenticacao_1.default.falhaAutenticacao, req, res));
            }
        });
    }
    exporRotas(app, aut, conexao) {
        app.route('/token').post(this.auth);
    }
}
exports.TokenRotas = TokenRotas;
exports.default = new TokenRotas();
