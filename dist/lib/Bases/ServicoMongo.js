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
class ServicoMongo {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }
    /**
     *
     * @param params <Object> Objeto com os parâmetros da busca a ser realizada
     * @returns Promise<T[]>
     */
    buscar(parametros) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscar(parametros);
        });
    }
    /**
     *
     * @param params <Object> Parametros da busca
     * @returns Promise<T> Primeiro objeto encontrado
     */
    buscarUm(parametros) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscarUm(parametros);
        });
    }
    /**
     * Retorna o objeto do id passado como parâmetro
     * @param id <string> ID do objeto a ser retornado
     * @returns Promise<T> Objeto encontrado
     */
    buscarPoId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscarPorId(id);
        });
    }
    /**
     * Retorna todos os documentos do Model
     * @returns Promise<T[]>
     */
    buscarTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.buscar({});
        });
    }
    /**
     * Persiste o objeto passado como parâmetro na base
     * @param objeto <T> Objeto a ser salvo
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repositorio.salvar(objeto);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Persiste os objetos passados como parâmetro na base
     * @param items <T[]> Objetos a serem persistidos
     * @returns Promise<T[]> Objeto criados
     */
    salvarLista(items) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let createdItems;
                items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    createdItems.push(yield this.repositorio.salvar(item));
                }));
                return createdItems;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Atualiza os dados do objeto passado como parâmetro
     * @param objeto <T> Objeto com os dados atualizados
     * @returns Promise<T> Objeto atualizado
     */
    atualizar(objeto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repositorio.atualizar(objeto);
        });
    }
    /**
     * Atualiza os dados dos objetos passado como parâmetro
     * @param items <T[]> Objetos a atualizados a serem salvos
     * @returns Promise<T[]> Objetos atualizados
     */
    atualizarLista(items) {
        return __awaiter(this, void 0, void 0, function* () {
            let itensCriados;
            items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                itensCriados.push(yield this.repositorio.atualizar(item));
            }));
            return itensCriados;
        });
    }
    /**
     * Remove o objeto desejado do banco
     * @param id <string> ID do objeto a ser removido
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    remover(id) {
        this.repositorio.remover(id, (erro, resultado) => {
            if (erro)
                console.error(erro);
        });
    }
    /**
     * Remove os objetos desejados do banco
     * @param ids <string[]> IDs do objetos a serem removidos
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    removerVarios(ids) {
        ids.forEach((id) => {
            this.repositorio.remover(id, (erro, resultado) => {
                if (erro)
                    console.error(erro);
            });
        });
    }
}
exports.default = ServicoMongo;
