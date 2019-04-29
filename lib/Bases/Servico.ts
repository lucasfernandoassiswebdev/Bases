import { Repositorio } from './Repositorio';
import { EntityManager } from 'typeorm';
import Page from '../Pagina';

export interface IServico<T> {
    buscar(params: any, transaction?: EntityManager): Promise<T[]>;
    buscarUm(params: any, transaction?: EntityManager): Promise<T>;
    buscarPorId(id: number, transaction?: EntityManager): Promise<T>;
    buscarTodos(pagina: number, limite: number): Promise<Page>;
    salvar(params: any, transaction?: EntityManager): Promise<T>;
    salvarLista(params: any[], transaction?: EntityManager): Promise<T[]>;
    remover(params: any, transaction?: EntityManager): void;
}

export class Servico<T> implements IServico<T> {

    /**
     * 
     * @param repositorio Repositorio<T>
     */
    constructor(private repositorio: Repositorio<T>) { }

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
     * @param id ID do objeto a ser encontrado
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    public buscarPorId = async (id: number, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.buscarPorId(id, transacao);
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
     * @param id <number> 
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    public remover = async (id: number, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.remover(id, transacao);
    }
}