import Repositorio from './Repositorio';
import { EntityManager } from 'typeorm';
import Page from '../Pagina';
export interface IServico<T> {
    buscar(params: any, transaction?: EntityManager): Promise<T[]>;
    buscarUm(params: any, transaction?: EntityManager): Promise<T>;
    buscarPorId(id: number, paramName?: string, transaction?: EntityManager): Promise<T>;
    buscarTodos(pagina: number, limite: number): Promise<Page>;
    salvar(params: any, transaction?: EntityManager): Promise<T>;
    salvarLista(params: any[], transaction?: EntityManager): Promise<T[]>;
    remover(params: any, paramName?: string, transaction?: EntityManager): void;
    removerObjeto(objeto: T, transacao?: EntityManager): Promise<T>;
}
export default abstract class Servico<T> implements IServico<T> {
    repositorio: Repositorio<T>;
    /**
     *
     * @param repositorio Repositorio<T>
     */
    constructor(repositorio: Repositorio<T>);
    /**
     * Método que inicia o repositório
     */
    iniciarRepositorio(): void;
    /**
     * Filtro avançado, utiliza os parâmetros da query string
     * @param pagina <number>
     * @param limite <number>
     * @param parametros <any> Query String
     */
    filtrar: (pagina: number, limite: number, parametros: any) => Promise<Page>;
    /**
     *
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    buscar: (parametros: Object, transacao?: EntityManager) => Promise<T[]>;
    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> parametros utilizados na busca(Object)
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto encontrado
     */
    buscarUm: (parametros: Object, transacao?: EntityManager) => Promise<T>;
    /**
     * Retorna o objeto do ID fornecido
     * @param id <number> ID do objeto a ser encontrado
     * @param paramName <string> nome do parâmetro que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    buscarPorId: (id: number, paramName?: string, transacao?: EntityManager) => Promise<T>;
    /**
     * Retorna a página desejada
     * @param pagina <number>
     * @param limite <number>
     * @returns Promise<Pagina>
     */
    buscarTodos: (pagina: number, limite: number) => Promise<Page>;
    /**
     *
     * @param objeto <T> Objeto a ser salvo
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto criado
     */
    salvar: (objeto: T, transacao?: EntityManager) => Promise<T>;
    /**
     *
     * @param items <T[]> lista dos objetos a serem salvos
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos criado
     */
    salvarLista: (items: T[], transacao?: EntityManager) => Promise<T[]>;
    /**
      *
      * @param id <number> ID do objeto a ser removido
      * @param paramName <string> nome da propriedade que identifica o objeto
      * @param transacao <EntityManager>
      * @returns Promise<T> Retorna o objeto removido
      */
    remover: (id: number, paramName?: string, transacao?: EntityManager) => Promise<T>;
    /**
     *
     * @param objeto <T> objeto a ser removido
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    removerObjeto: (objeto: T, transacao?: EntityManager) => Promise<T>;
}
