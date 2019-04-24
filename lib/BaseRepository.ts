import { Repository, getConnection, EntityManager } from 'typeorm';
import Page from './Page';

export interface IRepository<T> {
    save(entity: any, transaction?: EntityManager): Promise<T>;
    find(params: Object, transaction?: EntityManager): Promise<T[]>;
    findOne(params: Object, transaction?: EntityManager): Promise<T>;
    findById(id: number, transaction?: EntityManager): Promise<T>;
    findAll(pagina: number, limite: number): Promise<Page>;
    remove(id: number, transaction?: EntityManager): Promise<T>;
}

export abstract class BaseRepository<T> implements IRepository<T> {

    public repository: Repository<T>;
    public page: Page;

    constructor(entityClass: any) {
        const connection = getConnection();
        this.repository = connection.getRepository(entityClass);
        this.page = new Page();
    }

    public async save(entity: any, transaction?: EntityManager): Promise<T> {
        return await typeof transaction !== 'undefined'
            ? transaction.save(entity)
            : this.repository.save(entity);
    }

    public async find(params: Object, transaction?: EntityManager): Promise<T[]> {
        return typeof transaction !== 'undefined'
            ? transaction.find(this.repository.metadata.target as any, params as any) as Promise<T[]>
            : this.repository.find(params);
    }

    public async findOne(params: Object, transaction?: EntityManager): Promise<T> {
        return typeof transaction !== 'undefined'
            ? transaction.findOne(this.repository.metadata.target as any, params as any) as Promise<T>
            : this.repository.findOne(params);
    }

    public async findById(id: number, transaction?: EntityManager): Promise<T> {
        return typeof transaction !== 'undefined'
            ? transaction.findOne(this.repository.metadata.target as any, { where: { id } } as any) as Promise<T>
            : this.repository.findOne({ where: { id } });
    }

    public async findAll(pagina: number, limite: number): Promise<Page> {
        try {
            if (!Number.isInteger(limite) || !Number.isInteger(pagina)) {
                return null;
            }

            pagina = pagina <= 0 ? 0 : (pagina - 1) * limite;

            let [result, count] = await this.repository.findAndCount({ skip: pagina, take: limite })

            let pages = Math.ceil(count / limite);
            this.page.content = result;
            this.page.first = pagina === 0;
            this.page.last = pages === pagina + 1;
            this.page.size = limite;
            this.page.numberOfElements = count;
            this.page.totalPages = pages;
            return this.page;
        } catch (err) {
            console.error(err.message);
            return err.message;
        }
    }

    public async remove(id: number, transaction?: EntityManager): Promise<T> {
        if (typeof transaction !== 'undefined') {
            const itemToRemove: T = await transaction.findOne(this.repository.target as any, { where: { id } } as any) as T;
            return transaction.remove(itemToRemove);
        } else {
            const itemToRemove: T = await this.repository.findOne({ where: { id } });
            return this.repository.remove(itemToRemove);
        }
    }
}
