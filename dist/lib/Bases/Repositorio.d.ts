import { Repository, EntityManager } from 'typeorm';
import Pagina from '../Pagina';
export interface IRepositorio<T> {
    salvar(entity: any, transaction?: EntityManager): Promise<T>;
    buscar(params: any, transaction?: EntityManager, pagina?: number, limite?: number): Promise<Pagina>;
    buscarUm(params: Object, transaction?: EntityManager): Promise<T>;
    buscarPorId(id: number, paramName?: string, transaction?: EntityManager, relations?: any): Promise<T>;
    buscarTodos(pagina: number, limite: number): Promise<Pagina>;
    remover(id: number, paramName?: string, transaction?: EntityManager): Promise<T>;
    removerObjeto(objeto: T, transacao?: EntityManager): Promise<T>;
}
export default abstract class Repositorio<T> implements IRepositorio<T> {
    private classeEntidade;
    repositorio: Repository<T>;
    pagina: Pagina;
    /**
     * Inicia a classe criando o repositório da classe genérica informada
     * @param classeEntidade <any> classe do Repositório
     */
    constructor(classeEntidade: any);
    /**
     * Inicia a variável repositório
     */
    iniciarRepositorio(): void;
    /**
     *
     * @param objeto <T> Objeto a ser salvo
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto: T, transacao?: EntityManager): Promise<T>;
    /**
     * Retorna uma página com os dados resultantes da busca de acordo com os parâmetros fornecidos
     * @param pagina <number>
     * @param limite <number>
     * @param parametros <any> Objeto com os dados a serem utilizados na busca
     */
    filtrar(pagina: number, limite: number, parametros: any): Promise<Pagina>;
    /**
     *
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    buscar(parametros: any, transacao?: EntityManager, pagina?: number, limite?: number): Promise<Pagina>;
    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> parametros utilizados na busca(Object)
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto encontrado
     */
    buscarUm(parametros: Object, transacao?: EntityManager): Promise<T>;
    /**
     * Retorna o objeto do ID fornecido
     * @param id ID do objeto a ser encontrado
     * @param paramName <string> nome do parâmetro que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    buscarPorId(id: number, paramName?: string, transacao?: EntityManager, relations?: any): Promise<T>;
    /**
     * Retorna a página desejada
     * @param pagina <number>
     * @param limite <number>
     * @returns Promise<Pagina>
     */
    buscarTodos(pagina: number, limite: number): Promise<Pagina>;
    /**
     *
     * @param id <number> ID do objeto a ser removido
     * @param paramName <string> nome da propriedade que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    remover(id: number, paramName?: string, transacao?: EntityManager): Promise<T>;
    /**
     *
     * @param objeto <T> objeto a ser removido
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    removerObjeto(objeto: T, transacao?: EntityManager): Promise<T>;
}
