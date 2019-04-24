"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class BaseMongoRepository {
    constructor(schemaModel) {
        this._model = schemaModel;
    }
    save(item) {
        return this._model.create(item);
    }
    retrieve(callback) {
        this._model.find({}, callback);
    }
    update(object) {
        return this._model.updateOne(object);
    }
    delete(_id, callback) {
        this._model.deleteOne({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }
    findById(_id, callback) {
        return callback != undefined
            ? this._model.findById(_id, callback)
            : this._model.findById(_id);
    }
    findOne(params) {
        return this._model.findOne(params);
    }
    find(params) {
        return this._model.find(params);
    }
    toObjectId(_id) {
        return mongoose_1.Types.ObjectId.createFromHexString(_id);
    }
}
exports.BaseMongoRepository = BaseMongoRepository;
