import { Query, Types, Model, Document } from 'mongoose';

export interface IRepositorioMongo<T> {
    retornar: (callback: (error: any, result: any) => void) => void;
    buscar(options: Object): Promise<T[]>;
    buscarPorId: (id: string, callback: (error: any, result: T) => void) => Promise<Query<T>>;
    buscarUm(params?: Object): Promise<T>;
    salvar: (item: T, callback: (error: any, result: any) => void) => Promise<T>;
    atualizar: (object: T) => Promise<T>;
    remover: (_id: string, callback: (error: any, result: any) => void) => void;
}

export class RepositorioMongo<T extends Document> implements IRepositorioMongo<T> {

    private modelo: any;

    constructor(schemaModel: Model<Document>) {
        this.modelo = schemaModel;
    }

    salvar(item: T): Promise<T> {
        return this.modelo.create(item);
    }

    retornar(callback: (error: any, result: T) => void) {
        this.modelo.find({}, callback);
    }

    atualizar(object: T): Promise<T> {
        return this.modelo.updateOne(object);
    }

    remover(_id: string, callback: (error: any, result: any) => void) {
        this.modelo.deleteOne({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }

    buscarPorId(_id: string, callback?: (error: any, result: T) => void): Promise<Query<T>> {
        return callback != undefined
            ? this.modelo.findById(_id, callback)
            : this.modelo.findById(_id);
    }

    buscarUm(params?: Object): Promise<T> {
        return this.modelo.findOne(params);
    }

    buscar(params?: Object): Promise<T[]> {
        return this.modelo.find(params);
    }

    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}