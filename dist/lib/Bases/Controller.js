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
const Manipuladores_1 = require("../Manipuladores");
const Criptografia_1 = require("../Seguran\u00E7a/Criptografia");
const Util_1 = require("../Util/Util");
class Controller {
    /**
     *
     * @param servico Servico<T> Serviço correspondente a classe do módulo
     */
    constructor(servico) {
        this.servico = servico;
        /**
         * Deve conter uma QueryString(URL) com os dados para a busca
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Lista de objetos encontrados de acordo com os parâmetros fornecidos
         */
        this.buscar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.servico.buscar(req.query)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Deve conter uma QueryString(URL) com os dados para a busca
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Promise<T> Primeiro objeto encontrado de acordo com os parâmetros fornecidos
         */
        this.buscarUm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.servico.buscarUm(req.params)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Deve conter na URL o parâmetro "ID" para a busca do objeto desejado
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Promise<T> Objeto com o ID informado
         */
        this.buscarPorId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id)
                _.partial(Manipuladores_1.default.erro, res, "Parâmetros necessários(id) não foram fornecidos");
            let id = Number.parseInt(req.params.id);
            yield this.servico.buscarPorId(id)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Busca todos os objetos na página desejada
         * É necessário fornecer na URL os parâmetros de página e limite
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Promise<T[]> Retorna os objetos encontrados na página informada
         */
        this.buscarTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.pagina || !req.params.limite)
                _.partial(Manipuladores_1.default.erro, res, "Parâmetros necessários(pagina e limite) não foram fornecidos");
            let pagina = Number.parseInt(req.params.pagina);
            let limite = Number.parseInt(req.params.limite);
            yield this.servico.buscarTodos(pagina, limite)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Salva o objeto<T> passado no corpo da requisição
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns <T> Retorna os dados do objeto criado
         */
        this.salvar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            req.body = yield this.criptografaSenhas(req.body);
            yield this.servico.salvar(req.body)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao salvar dados fornecidos"));
        });
        /**
         * Salva a lista de objetos<T[]> passados no corpo da requisição
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns <T[]> Retorna a lista de dados dos objetos criados
         */
        this.salvarLista = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield req.body.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                item = yield this.criptografaSenhas(item);
            }));
            yield this.servico.salvarLista(req.body)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao salvar lista de dados fornecidos"));
        });
        /**
         * Remove o objeto do ID passado como parâmetro na URL
         * @param req <Request> (express)
         * @param res <Response> (express)
         */
        this.remover = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id)
                _.partial(Manipuladores_1.default.erro, res, "Parâmetros necessários(id) não foram fornecidos");
            let id = Number.parseInt(req.params.id);
            yield this.servico.remover(id)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao remover dados fornecidos"));
        });
        this.criptografaSenhas = (objeto) => __awaiter(this, void 0, void 0, function* () {
            Util_1.default.asyncForEach(Object.getOwnPropertyNames(objeto), (propriedade) => __awaiter(this, void 0, void 0, function* () {
                if (propriedade.startsWith("senha"))
                    Object[propriedade] = yield Criptografia_1.default.criptografar(objeto[propriedade]);
            }));
            return objeto;
        });
    }
}
exports.default = Controller;
