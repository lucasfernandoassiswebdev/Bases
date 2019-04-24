"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseMongoService {
    constructor(repository) {
        this.repository = repository;
    }
    get(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find(params);
        });
    }
    getOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne(params);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findById(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({});
        });
    }
    create(object) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.save(object);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let createdItems;
                items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    createdItems.push(yield this.repository.save(item));
                }));
                return createdItems;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    update(object) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.update(object);
        });
    }
    updateMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdItems;
            items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                createdItems.push(yield this.repository.update(item));
            }));
            return createdItems;
        });
    }
    delete(_id) {
        this.repository.delete(_id, (err, result) => {
            if (err)
                console.error(err);
        });
    }
}
exports.BaseMongoService = BaseMongoService;
