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

    /**
     * 
     * @param repositorio Repositorio<T>
     */
    constructor(public repositorio: Repositorio<T>) {

    }

    /**
     * Método que inicia o repositório
     */
    public iniciarRepositorio(): void {
        this.repositorio.iniciarRepositorio();
    }

    /**
     * Filtro avançado, utiliza os parâmetros da query string
     * @param pagina <number> 
     * @param limite <number> 
     * @param parametros <any> Query String
     */
    public filtrar = async (pagina: number, limite: number, parametros: any): Promise<Page> => {
        return await this.repositorio.filtrar(pagina, limite, parametros);
    }

    /**
     * 
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    public buscar = async (parametros: Object, transacao?: EntityManager): Promise<T[]> => {
        return await this.repositorio.buscar(parametros, transacao);
    }

    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> parametros utilizados na busca(Object)
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto encontrado
     */
    public buscarUm = async (parametros: Object, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.buscarUm(parametros, transacao);
    }

    /**
     * Retorna o objeto do ID fornecido
     * @param id <number> ID do objeto a ser encontrado
     * @param paramName <string> nome do parâmetro que identifica o objeto
     * @param transacao <EntityManager>      
     * @returns Promise<T>
     */
    public buscarPorId = async (id: number, paramName?: string, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.buscarPorId(id, paramName, transacao);
    }

    /**
     * Retorna a página desejada
     * @param pagina <number>
     * @param limite <number>
     * @returns Promise<Pagina>
     */
    public buscarTodos = async (pagina: number, limite: number): Promise<Page> => {
        return await this.repositorio.buscarTodos(pagina, limite);
    }

    /**
     * 
     * @param objeto <T> Objeto a ser salvo
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto criado
     */
    public salvar = async (objeto: T, transacao?: EntityManager): Promise<T> => {
        try {
            return await this.repositorio.salvar(objeto, transacao);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param items <T[]> lista dos objetos a serem salvos
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos criado
     */
    public salvarLista = async (items: T[], transacao?: EntityManager): Promise<T[]> => {
        try {
            let createdItems: Array<T>;
            items.forEach(async (item) => {
                createdItems.push(await this.repositorio.salvar(item, transacao));
            });

            return createdItems;
        } catch (error) {
            console.error(error);
        }
    }

    /**
      * 
      * @param id <number> ID do objeto a ser removido
      * @param paramName <string> nome da propriedade que identifica o objeto
      * @param transacao <EntityManager>
      * @returns Promise<T> Retorna o objeto removido
      */
    public remover = async (id: number, paramName?: string, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.remover(id, paramName, transacao);
    }

    /**
     * 
     * @param objeto <T> objeto a ser removido
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    public removerObjeto = async (objeto: T, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.removerObjeto(objeto, transacao);
    }
}