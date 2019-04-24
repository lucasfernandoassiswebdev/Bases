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
class BaseService {
    constructor(repository) {
        this.repository = repository;
        this.find = (params, transaction) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find(params, transaction);
        });
        this.findOne = (params, transaction) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findOne(params, transaction);
        });
        this.findById = (id, transaction) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findById(id, transaction);
        });
        this.findAll = (pagina, limite) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findAll(pagina, limite);
        });
        this.save = (object, transaction) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.save(object, transaction);
            }
            catch (error) {
                console.error(error);
            }
        });
        this.saveMany = (items, transaction) => __awaiter(this, void 0, void 0, function* () {
            try {
                let createdItems;
                items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    createdItems.push(yield this.repository.save(item, transaction));
                }));
                return createdItems;
            }
            catch (error) {
                console.error(error);
            }
        });
        this.delete = (_id, transaction) => {
            this.repository.remove(_id, transaction);
        };
    }
}
exports.BaseService = BaseService;
