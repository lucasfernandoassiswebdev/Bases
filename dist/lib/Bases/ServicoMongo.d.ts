import RepositorioMongo from './RepositorioMongo';
import { Document } from 'mongoose';
export interface IServicoMongo<T extends Document> {
    buscar(params: any): Promise<T[]>;
    buscarUm(params: any): Promise<T>;
    buscarPoId(id: string): Promise<T>;
    buscarTodos(): Promise<T[]>;
    salvar(params: any): Promise<T>;
    salvarLista(params: any[]): Promise<T[]>;
    atualizar(params: any): Promise<T>;
    atualizarLista(params: any[]): Promise<T[]>;
    remover(params: any): void;
}
export default abstract class ServicoMongo<T extends Document> implements IServicoMongo<T> {
    private repositorio;
    constructor(repositorio: RepositorioMongo<T>);
    /**
     *
     * @param params <Object> Objeto com os parâmetros da busca a ser realizada
     * @returns Promise<T[]>
     */
    buscar(parametros: Object): Promise<T[]>;
    /**
     *
     * @param params <Object> Parametros da busca
     * @returns Promise<T> Primeiro objeto encontrado
     */
    buscarUm(parametros: Object): Promise<T>;
    /**
     * Retorna o objeto do id passado como parâmetro
     * @param id <string> ID do objeto a ser retornado
     * @returns Promise<T> Objeto encontrado
     */
    buscarPoId(id: string): Promise<T>;
    /**
     * Retorna todos os documentos do Model
     * @returns Promise<T[]>
     */
    buscarTodos(): Promise<T[]>;
    /**
     * Persiste o objeto passado como parâmetro na base
     * @param objeto <T> Objeto a ser salvo
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto: T): Promise<T>;
    /**
     * Persiste os objetos passados como parâmetro na base
     * @param items <T[]> Objetos a serem persistidos
     * @returns Promise<T[]> Objeto criados
     */
    salvarLista(items: T[]): Promise<T[]>;
    /**
     * Atualiza os dados do objeto passado como parâmetro
     * @param objeto <T> Objeto com os dados atualizados
     * @returns Promise<T> Objeto atualizado
     */
    atualizar(objeto: T): Promise<T>;
    /**
     * Atualiza os dados dos objetos passado como parâmetro
     * @param items <T[]> Objetos a atualizados a serem salvos
     * @returns Promise<T[]> Objetos atualizados
     */
    atualizarLista(items: T[]): Promise<T[]>;
    /**
     * Remove o objeto desejado do banco
     * @param id <string> ID do objeto a ser removido
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    remover(id: string): void;
    /**
     * Remove os objetos desejados do banco
     * @param ids <string[]> IDs do objetos a serem removidos
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    removerVarios(ids: string[]): void;
}
