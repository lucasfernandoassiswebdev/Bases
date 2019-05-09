"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const Autenticacao_1 = __importDefault(require("./Autenticacao"));
class TokenRotas {
    constructor(servico, chaveCriptografia) {
        this.servico = servico;
        this.chaveCriptografia = chaveCriptografia;
        /**
         * Método que autentica as rotas necessárias
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @param servico <any> Classe que extenda Servico<T> deve obrigatoriamente ter o método "buscarPorEmail"
         * @returns <Response> (express)
         */
        this.auth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const credenciais = {
                email: req.body.email,
                senha: req.body.senha
            };
            if (credenciais.email) {
                yield this.servico.buscarPorEmail(credenciais.email)
                    .then((usuario) => Autenticacao_1.default.sucessoAutenticacao(res, credenciais.senha, usuario, this.chaveCriptografia))
                    .catch(_.partial(Autenticacao_1.default.falhaAutenticacao, req, res));
            }
        });
    }
    exporRotas(app) {
        app.route('/token').post(this.auth);
    }
    exporControllers() {
        return [];
    }
}
exports.default = TokenRotas;
