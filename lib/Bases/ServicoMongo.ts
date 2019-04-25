import { RepositorioMongo } from './RepositorioMongo';
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

export class ServicoMongo<T extends Document> implements IServicoMongo<T> {

    constructor(private repositorio: RepositorioMongo<T>) { }

    async buscar(params): Promise<T[]> {
        return await this.repositorio.buscar(params);
    }

    async buscarUm(params): Promise<T> {
        return await this.repositorio.buscarUm(params);
    }

    async buscarPoId(id: string): Promise<T> {
        return await this.repositorio.buscarPorId(id);
    }

    async buscarTodos(): Promise<T[]> {
        return await this.repositorio.buscar({});
    }

    async salvar(object: T): Promise<T> {
        try {
            return await this.repositorio.salvar(object);
        } catch (error) {
            console.error(error);
        }
    }

    async salvarLista(items: T[]): Promise<T[]> {
        try {
            let createdItems: Array<T>;
            items.forEach(async (item) => {
                createdItems.push(await this.repositorio.salvar(item));
            });

            return createdItems;
        } catch (error) {
            console.error(error);
        }
    }

    async atualizar(object: T): Promise<T> {
        return await this.repositorio.atualizar(object);
    }

    async atualizarLista(items: T[]): Promise<T[]> {
        let itensCriados: Array<T>;
        items.forEach(async (item) => {
            itensCriados.push(await this.repositorio.atualizar(item));
        });

        return itensCriados;
    }

    remover(_id: string): void {
        this.repositorio.remover(_id, (erro: any, resultado: any) => {
            if (erro)
                console.error(erro);
        });
    }
}
