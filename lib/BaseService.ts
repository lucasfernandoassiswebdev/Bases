import { BaseRepository } from './BaseRepository';
import { EntityManager } from 'typeorm';
import Page from './Page';

export interface IService<T> {
    find(params: any, transaction?: EntityManager): Promise<T[]>;
    findOne(params: any, transaction?: EntityManager): Promise<T>;
    findById(id: number, transaction?: EntityManager): Promise<T>;
    findAll(pagina: number, limite: number): Promise<Page>;
    save(params: any, transaction?: EntityManager): Promise<T>;
    saveMany(params: any[], transaction?: EntityManager): Promise<T[]>;
    delete(params: any, transaction?: EntityManager): void;
}

export class BaseService<T> implements IService<T> {

    constructor(private repository: BaseRepository<T>) { }

    public find = async (params: any, transaction?: EntityManager): Promise<T[]> => {
        return await this.repository.find(params, transaction);
    }

    public findOne = async (params: any, transaction?: EntityManager): Promise<T> => {
        return await this.repository.findOne(params, transaction);
    }

    public findById = async (id: number, transaction?: EntityManager): Promise<T> => {
        return await this.repository.findById(id, transaction);
    }

    public findAll = async (pagina: number, limite: number): Promise<Page> => {
        return await this.repository.findAll(pagina, limite);
    }

    public save = async (object: T, transaction?: EntityManager): Promise<T> => {
        try {
            return await this.repository.save(object, transaction);
        } catch (error) {
            console.error(error);
        }
    }

    public saveMany = async (items: T[], transaction?: EntityManager): Promise<T[]> => {
        try {
            let createdItems: Array<T>;
            items.forEach(async (item) => {
                createdItems.push(await this.repository.save(item, transaction));
            });

            return createdItems;
        } catch (error) {
            console.error(error);
        }
    }

    public delete = (_id: number, transaction?: EntityManager): void => {
        this.repository.remove(_id, transaction);
    }
}