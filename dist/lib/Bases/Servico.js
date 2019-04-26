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
     * @param repositorio <Repositorio<T>
     */
    constructor(repositorio) {
        this.repositorio = repositorio;
        /**
         *
         * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
         * @param transacao <EntityManager>
         * @returns Promise<T[]> Objetos encontrados
         */
        this.buscar = (parametros, transacao) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscar(parametros, transacao);
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
         * @param id ID do objeto a ser encontrado
         * @param transacao <EntityManager>
         * @returns Promise<T>
         */
        this.buscarPorId = (id, transacao) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscarPorId(id, transacao);
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
         * @param id <number>
         * @param transacao <EntityManager>
         * @returns Promise<T>
         */
        this.remover = (id, transacao) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.remover(id, transacao);
        });
    }
}
exports.Servico = Servico;