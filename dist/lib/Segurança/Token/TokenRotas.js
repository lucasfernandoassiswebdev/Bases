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
    constructor(servico, chaveCriptografia, paramName) {
        this.servico = servico;
        this.chaveCriptografia = chaveCriptografia;
        this.paramName = paramName;
        /**
         * Método que autentica as rotas necessárias
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @param servico <any> Classe que extenda Servico<T> deve obrigatoriamente ter o método "buscarUsuario"
         * @returns <Response> (express)
         */
        this.auth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const credenciais = req.body;
            if (!Object.entries(credenciais).length) {
                Autenticacao_1.default.autenticacaoIrregular(req, res, 'Corpo da requisição vazio');
            }
            else if (!credenciais.senha) {
                Autenticacao_1.default.autenticacaoIrregular(req, res, 'É necessário que o corpo da requisição tenha o parâmetro \"senha\" fornecido para gerar o Token.');
            }
            else {
                let senha = credenciais.senha;
                delete credenciais.senha;
                yield this.servico.buscarUsuario(credenciais)
                    .then((usuario) => Autenticacao_1.default.sucessoAutenticacao(res, senha, usuario, this.chaveCriptografia, this.paramName))
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
