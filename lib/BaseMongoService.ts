import { BaseMongoRepository } from './BaseMongoRepository';
import { Document } from 'mongoose';

export interface IMongoService<T extends Document> {
    get(params: any): Promise<T[]>;
    getOne(params: any): Promise<T>;
    getAll(): Promise<T[]>;
    create(params: any): Promise<T>;
    createMany(params: any[]): Promise<T[]>;
    update(params: any): Promise<T>;
    updateMany(params: any[]): Promise<T[]>;
    delete(params: any): void;
}

export class BaseMongoService<T extends Document> implements IMongoService<T> {

    constructor(private repository: BaseMongoRepository<T>) { }

    async get(params): Promise<T[]> {
        return await this.repository.find(params);
    }

    async getOne(params): Promise<T> {
        return await this.repository.findOne(params);
    }

    async getById(id: string): Promise<T> {
        return await this.repository.findById(id);
    }

    async getAll(): Promise<T[]> {
        return await this.repository.find({});
    }

    async create(object: T): Promise<T> {
        try {
            return await this.repository.save(object);
        } catch (error) {
            console.error(error);
        }
    }

    async createMany(items: T[]): Promise<T[]> {
        try {
            let createdItems: Array<T>;
            items.forEach(async (item) => {
                createdItems.push(await this.repository.save(item));
            });

            return createdItems;
        } catch (error) {
            console.error(error);
        }
    }

    async update(object: T): Promise<T> {
        return await this.repository.update(object);
    }

    async updateMany(items: T[]): Promise<T[]> {
        let createdItems: Array<T>;
        items.forEach(async (item) => {
            createdItems.push(await this.repository.update(item));
        });

        return createdItems;
    }

    delete(_id: string): void {
        this.repository.delete(_id, (err: any, result: any) => {
            if (err)
                console.error(err);
        });
    }
}
