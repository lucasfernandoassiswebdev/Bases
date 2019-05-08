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
const typeorm_1 = require("typeorm");
const Pagina_1 = require("../Pagina");
class Repositorio {
    /**
     * Inicia a classe criando o repositório da classe genérica informada
     * @param classeEntidade TypeORM Model
     */
    constructor(classeEntidade) {
        this.repositorio = typeorm_1.getRepository(classeEntidade);
        this.pagina = new Pagina_1.default();
    }
    /**
     *
     * @param objeto <T> Objeto a ser salvo
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield typeof transacao) !== 'undefined'
                ? transacao.save(objeto)
                : this.repositorio.save(objeto);
        });
    }
    /**
     *
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    buscar(parametros, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transacao !== 'undefined'
                ? transacao.find(this.repositorio.metadata.target, parametros)
                : this.repositorio.find(parametros);
        });
    }
    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> parametros utilizados na busca(Object)
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto encontrado
     */
    buscarUm(parametros, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transacao !== 'undefined'
                ? transacao.findOne(this.repositorio.metadata.target, parametros)
                : this.repositorio.findOne(parametros);
        });
    }
    /**
     * Retorna o objeto do ID fornecido
     * @param id ID do objeto a ser encontrado
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    buscarPorId(id, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transacao !== 'undefined'
                ? transacao.findOne(this.repositorio.metadata.target, { where: { id } })
                : this.repositorio.findOne({ where: { id } });
        });
    }
    /**
     * Retorna a página desejada
     * @param pagina <number>
     * @param limite <number>
     * @returns Promise<Pagina>
     */
    buscarTodos(pagina, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number.isInteger(limite) || !Number.isInteger(pagina)) {
                    return null;
                }
                pagina = pagina <= 0 ? 0 : (pagina - 1) * limite;
                let [result, count] = yield this.repositorio.findAndCount({ skip: pagina, take: limite });
                let paginas = Math.ceil(count / limite);
                this.pagina.content = result;
                this.pagina.first = pagina === 0;
                this.pagina.last = paginas === pagina + 1;
                this.pagina.size = limite;
                this.pagina.numberOfElements = count;
                this.pagina.totalPages = paginas;
                return this.pagina;
            }
            catch (err) {
                console.error(err.message);
                return err.message;
            }
        });
    }
    /**
     *
     * @param id <number> ID do objeto a ser removido
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    remover(id, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof transacao !== 'undefined') {
                const itemToRemove = yield transacao.findOne(this.repositorio.target, { where: { id } });
                return transacao.remove(itemToRemove);
            }
            else {
                const itemToRemove = yield this.repositorio.findOne({ where: { id } });
                return this.repositorio.remove(itemToRemove);
            }
        });
    }
}
exports.Repositorio = Repositorio;
