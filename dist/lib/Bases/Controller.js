"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Manipuladores_1 = __importDefault(require("../Manipuladores"));
const Util_1 = __importDefault(require("../Util/Util"));
class Controller {
    /**
     *
     * @param servico Servico<T> Serviço correspondente a classe do módulo
     */
    constructor(servico) {
        this.servico = servico;
        /**
         * Filtro avançado, utiliza os parâmetros da query string
         * É necessário passar nos parâmetros da url página e limite, ambos do tipo <number>
         * Caso não fornecidos, assumem os valores 0 e 100 respectivamente como default
         * @param <Request> (express)
         * @param <Response> (express)
         */
        this.filtrar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let pagina = req.params.pagina ? Number.parseInt(req.params.pagina) : 0;
            let limite = req.params.limite ? Number.parseInt(req.params.limite) : 100;
            let parametros = req.query;
            if (Object.entries(parametros).length === 0 && parametros.constructor === Object)
                lodash_1.default.partial(Manipuladores_1.default.erro, res, "Nenhum parâmetro foi fornecido na query string");
            yield this.servico.filtrar(pagina, limite, parametros)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Deve conter uma QueryString(URL) com os dados para a busca
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Lista de objetos encontrados de acordo com os parâmetros fornecidos
         */
        this.buscar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.servico.buscar(req.query)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Deve conter uma QueryString(URL) com os dados para a busca
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Promise<T> Primeiro objeto encontrado de acordo com os parâmetros fornecidos
         */
        this.buscarUm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.servico.buscarUm(req.params)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Deve conter na URL o parâmetro "ID" para a busca do objeto desejado
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns Promise<T> Objeto com o ID informado
         */
        this.buscarPorId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id)
                lodash_1.default.partial(Manipuladores_1.default.erro, res, "Parâmetro necessário(id) não foi fornecido");
            let id = Number.parseInt(req.params.id);
            yield this.servico.buscarPorId(id)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
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
                lodash_1.default.partial(Manipuladores_1.default.erro, res, "Parâmetros necessários(pagina e limite) não foram fornecidos");
            let pagina = Number.parseInt(req.params.pagina);
            let limite = Number.parseInt(req.params.limite);
            yield this.servico.buscarTodos(pagina, limite)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        /**
         * Salva o objeto<T> passado no corpo da requisição
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns <T> Retorna os dados do objeto criado
         */
        this.salvar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            req.body = yield Util_1.default.criptografaSenhas(req.body);
            yield this.servico.salvar(req.body)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao salvar dados fornecidos"));
        });
        /**
         * Salva a lista de objetos<T[]> passados no corpo da requisição
         * @param req <Request> (express)
         * @param res <Response> (express)
         * @returns <T[]> Retorna a lista de dados dos objetos criados
         */
        this.salvarLista = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield req.body.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                item = yield Util_1.default.criptografaSenhas(item);
            }));
            yield this.servico.salvarLista(req.body)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao salvar lista de dados fornecidos"));
        });
        /**
         * Remove o objeto do ID passado como parâmetro na URL
         * @param req <Request> (express)
         * @param res <Response> (express)
         */
        this.remover = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id)
                lodash_1.default.partial(Manipuladores_1.default.erro, res, "Parâmetro necessário(id) não foram fornecido");
            let id = Number.parseInt(req.params.id);
            yield this.servico.remover(id)
                .then(lodash_1.default.partial(Manipuladores_1.default.sucesso, res))
                .catch(lodash_1.default.partial(Manipuladores_1.default.erro, res, "Erro ao remover dados fornecidos"));
        });
    }
    /**
     * Inicia o Repositório de acordo com T
     */
    iniciarRepositorio() {
        this.servico.iniciarRepositorio();
    }
}
exports.default = Controller;
