"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class RepositorioMongo {
    /**
     * Inicia a classe criando o repositorio da classe modelo passada como argumento
     * @param schemaModel Model<Document>
     */
    constructor(schemaModel) {
        this.repositorio = schemaModel;
    }
    /**
     * Persiste o objeto passado na base
     * @param objeto <T> Objeto a ser salvo
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto) {
        return this.repositorio.create(objeto);
    }
    /**
     * Atualiza os dados do objeto passado
     * @param objeto <T> Objeto com os dados atualizados
     * @returns Promise<T> Objeto atualizado
     */
    atualizar(objeto) {
        return this.repositorio.updateOne(objeto);
    }
    /**
     * Remove o objeto desejado do banco
     * @param id <string> ID do objeto a ser removido
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    remover(id, callback) {
        this.repositorio.deleteOne({ _id: this.toObjectId(id) }, (erro) => callback(erro, null));
    }
    /**
     * Retorna o objeto do id selecionado
     * @param id <string> ID do objeto a ser retornado
     * @param callback <Function> Função com os parâmetros erro(any) e resultado(any)
     * @returns Promise<T> Objeto encontrado
     */
    buscarPorId(id, callback) {
        return callback != undefined
            ? this.repositorio.findById(id, callback)
            : this.repositorio.findById(id);
    }
    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> Objeto com os parâmetros do documento que se está buscando
     * @returns Promise<T> Primeiro objeto encontrado
     */
    buscarUm(parametros) {
        return this.repositorio.findOne(parametros);
    }
    /**
     * Retorna uma lista de objetos de acordo com os parâmetros fornecidos
     * @param parametros <Object> Objeto com os parâmetros do documento que se está buscando
     * @returns Promise<T[]> Objetos encontrados
     */
    buscar(parametros) {
        return this.repositorio.find(parametros);
    }
    /**
     *
     * @param id <string>
     * @returns <Types.ObjectId>
     */
    toObjectId(id) {
        return mongoose_1.Types.ObjectId.createFromHexString(id);
    }
}
exports.RepositorioMongo = RepositorioMongo;
