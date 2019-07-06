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
class Servico {
    /**
     *
     * @param repositorio Repositorio<T>
     */
    constructor(repositorio) {
        this.repositorio = repositorio;
        /**
         * Filtro avançado, utiliza os parâmetros da query string
         * @param pagina <number>
         * @param limite <number>
         * @param parametros <any> Query String
         */
        this.filtrar = (pagina, limite, parametros) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.filtrar(pagina, limite, parametros);
        });
        /**
         *
         * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
         * @param transacao <EntityManager>
         * @returns Promise<T[]> Objetos encontrados
         */
        this.buscar = (parametros, transacao, pagina, limite) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscar(parametros, transacao, pagina, limite);
        });
        /**
         * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
         * @param parametros <Object> parametros utilizados na busca(Object)
         * @param transacao <EntityManager>
         * @returns Promise<T> Objeto encontrado
         */
        this.buscarUm = (parametros, transacao) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscarUm(parametros, transacao);
        });
        /**
         * Retorna o objeto do ID fornecido
         * @param id <number> ID do objeto a ser encontrado
         * @param paramName <string> nome do parâmetro que identifica o objeto
         * @param transacao <EntityManager>
         * @returns Promise<T>
         */
        this.buscarPorId = (id, paramName, transacao, relations) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscarPorId(id, paramName, transacao, relations);
        });
        /**
         * Retorna a página desejada
         * @param pagina <number>
         * @param limite <number>
         * @returns Promise<Pagina>
         */
        this.buscarTodos = (pagina, limite) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscarTodos(pagina, limite);
        });
        /**
         *
         * @param objeto <T> Objeto a ser salvo
         * @param transacao <EntityManager>
         * @returns Promise<T> Objeto criado
         */
        this.salvar = (objeto, transacao) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repositorio.salvar(objeto, transacao);
            }
            catch (error) {
                console.error(error);
            }
        });
        /**
         *
         * @param items <T[]> lista dos objetos a serem salvos
         * @param transacao <EntityManager>
         * @returns Promise<T[]> Objetos criado
         */
        this.salvarLista = (items, transacao) => __awaiter(this, void 0, void 0, function* () {
            try {
                let createdItems;
                items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    createdItems.push(yield this.repositorio.salvar(item, transacao));
                }));
                return createdItems;
            }
            catch (error) {
                console.error(error);
            }
        });
        /**
          *
          * @param id <number> ID do objeto a ser removido
          * @param paramName <string> nome da propriedade que identifica o objeto
          * @param transacao <EntityManager>
          * @returns Promise<T> Retorna o objeto removido
          */
        this.remover = (id, paramName, transacao) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.remover(id, paramName, transacao);
        });
        /**
         *
         * @param objeto <T> objeto a ser removido
         * @param transacao <EntityManager>
         * @returns Promise<T> Retorna o objeto removido
         */
        this.removerObjeto = (objeto, transacao) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.removerObjeto(objeto, transacao);
        });
    }
    /**
     * Método que inicia o repositório
     */
    iniciarRepositorio() {
        this.repositorio.iniciarRepositorio();
    }
}
exports.default = Servico;
