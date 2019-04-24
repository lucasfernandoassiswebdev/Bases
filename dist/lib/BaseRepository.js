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
const typeorm_1 = require("typeorm");
const Page_1 = require("./Page");
class BaseRepository {
    constructor(entityClass) {
        const connection = typeorm_1.getConnection();
        this.repository = connection.getRepository(entityClass);
        this.page = new Page_1.default();
    }
    save(entity, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield typeof transaction) !== 'undefined'
                ? transaction.save(entity)
                : this.repository.save(entity);
        });
    }
    find(params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transaction !== 'undefined'
                ? transaction.find(this.repository.metadata.target, params)
                : this.repository.find(params);
        });
    }
    findOne(params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transaction !== 'undefined'
                ? transaction.findOne(this.repository.metadata.target, params)
                : this.repository.findOne(params);
        });
    }
    findById(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transaction !== 'undefined'
                ? transaction.findOne(this.repository.metadata.target, { where: { id } })
                : this.repository.findOne({ where: { id } });
        });
    }
    findAll(pagina, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number.isInteger(limite) || !Number.isInteger(pagina)) {
                    return null;
                }
                pagina = pagina <= 0 ? 0 : (pagina - 1) * limite;
                let [result, count] = yield this.repository.findAndCount({ skip: pagina, take: limite });
                let pages = Math.ceil(count / limite);
                this.page.content = result;
                this.page.first = pagina === 0;
                this.page.last = pages === pagina + 1;
                this.page.size = limite;
                this.page.numberOfElements = count;
                this.page.totalPages = pages;
                return this.page;
            }
            catch (err) {
                console.error(err.message);
                return err.message;
            }
        });
    }
    remove(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof transaction !== 'undefined') {
                const itemToRemove = yield transaction.findOne(this.repository.target, { where: { id } });
                return transaction.remove(itemToRemove);
            }
            else {
                const itemToRemove = yield this.repository.findOne({ where: { id } });
                return this.repository.remove(itemToRemove);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
