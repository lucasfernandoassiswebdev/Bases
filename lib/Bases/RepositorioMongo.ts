import { Types, Model, Document } from 'mongoose';

export interface IRepositorioMongo<T> {
    buscar(options: Object): Promise<T[]>;
    buscarPorId: (id: string, callback: (error: any, result: T) => void) => Promise<T>;
    buscarUm(params?: Object): Promise<T>;
    salvar: (item: T, callback: (error: any, result: any) => void) => Promise<T>;
    atualizar: (object: T) => Promise<T>;
    remover: (_id: string, callback: (error: any, result: any) => void) => void;
}

export default abstract class RepositorioMongo<T extends Document> implements IRepositorioMongo<T> {

    private repositorio: any;

    /**
     * Inicia a classe criando o repositorio da classe modelo passada como argumento
     * @param schemaModel Model<Document>
     */
    constructor(schemaModel: Model<Document>) {
        this.repositorio = schemaModel;
    }

    /**
     * Persiste o objeto passado na base
     * @param objeto <T> Objeto a ser salvo
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto: T): Promise<T> {
        return this.repositorio.create(objeto);
    }

    /**
     * Atualiza os dados do objeto passado
     * @param objeto <T> Objeto com os dados atualizados 
     * @returns Promise<T> Objeto atualizado
     */
    atualizar(objeto: T): Promise<T> {
        return this.repositorio.updateOne(objeto);
    }

    /**
     * Remove o objeto desejado do banco
     * @param id <string> ID do objeto a ser removido
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    remover(id: string, callback: (erro: any, resultado: any) => void) {        
        this.repositorio.deleteOne({ _id: this.toObjectId(id) }, (erro: any) => callback(erro, null));
    }    

    /**
     * Retorna o objeto do id selecionado
     * @param id <string> ID do objeto a ser retornado
     * @param callback <Function> Função com os parâmetros erro(any) e resultado(any)
     * @returns Promise<T> Objeto encontrado 
     */
    buscarPorId(id: string, callback?: (error: any, result: T) => void): Promise<T> {
        return callback != undefined
            ? this.repositorio.findById(id, callback)
            : this.repositorio.findById(id);
    }

    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> Objeto com os parâmetros do documento que se está buscando
     * @returns Promise<T> Primeiro objeto encontrado
     */
    buscarUm(parametros?: Object): Promise<T> {
        return this.repositorio.findOne(parametros);
    }

    /**
     * Retorna uma lista de objetos de acordo com os parâmetros fornecidos
     * @param parametros <Object> Objeto com os parâmetros do documento que se está buscando
     * @returns Promise<T[]> Objetos encontrados
     */
    buscar(parametros?: Object): Promise<T[]> {
        return this.repositorio.find(parametros);
    }

    /**
     * 
     * @param id <string>
     * @returns <Types.ObjectId>
     */
    private toObjectId(id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(id);
    }
}