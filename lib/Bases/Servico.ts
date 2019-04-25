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

    constructor(private repositorio: Repositorio<T>) { }

    public buscar = async (parametros: any, transacao?: EntityManager): Promise<T[]> => {
        return await this.repositorio.buscar(parametros, transacao);
    }

    public buscarUm = async (parametros: any, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.buscarUm(parametros, transacao);
    }

    public buscarPorId = async (id: number, transacao?: EntityManager): Promise<T> => {
        return await this.repositorio.buscarPorId(id, transacao);
    }

    public buscarTodos = async (pagina: number, limite: number): Promise<Page> => {
        return await this.repositorio.buscarTodos(pagina, limite);
    }

    public salvar = async (objeto: T, transacao?: EntityManager): Promise<T> => {
        try {
            return await this.repositorio.salvar(objeto, transacao);
        } catch (error) {
            console.error(error);
        }
    }

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

    public remover = (_id: number, transacao?: EntityManager): void => {
        this.repositorio.remover(_id, transacao);
    }
}