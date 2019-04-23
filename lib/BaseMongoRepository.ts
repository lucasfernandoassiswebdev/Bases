import { Query, Types, Model, Document } from 'mongoose';

export interface IRead<T> {
    retrieve: (callback: (error: any, result: any) => void) => void;
    findById: (id: string, callback: (error: any, result: T) => void) => Promise<Query<T>>;
    findOne(params?: Object): Promise<T>;
    find(options: Object): Promise<T[]>;
}

export interface IWrite<T> {
    save: (item: T, callback: (error: any, result: any) => void) => Promise<T>;
    update: (object: T) => Promise<T>;
    delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

export class BaseMongoRepository<T extends Document> implements IRead<T>, IWrite<T> {

    private _model: any;

    constructor(schemaModel: Model<Document>) {
        this._model = schemaModel;
    }

    save(item: T): Promise<T> {
        return this._model.create(item);
    }

    retrieve(callback: (error: any, result: T) => void) {
        this._model.find({}, callback);
    }

    update(object: T): Promise<T> {
        return this._model.updateOne(object);
    }

    delete(_id: string, callback: (error: any, result: any) => void) {
        this._model.deleteOne({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }

    findById(_id: string, callback?: (error: any, result: T) => void): Promise<Query<T>> {
        return callback != undefined
            ? this._model.findById(_id, callback)
            : this._model.findById(_id);
    }

    findOne(params?: Object): Promise<T> {
        return this._model.findOne(params);
    }

    find(params?: Object): Promise<T[]> {        
        return this._model.find(params);
    }

    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}