"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Criptografia_1 = __importDefault(require("../Seguran\u00E7a/Criptografia"));
class Util {
    constructor() {
        /**
         * Criptografa as propriedades do objeto que comecem com a palavra "senha"
         * @param objeto <T> objeto em que as propriedades serão criptografadas
         * @returns Promise<T> objeto com as propriedades criptografadas
         */
        this.criptografaSenhas = (objeto) => __awaiter(this, void 0, void 0, function* () {
            yield this.executeasyncForEach(Object.getOwnPropertyNames(objeto), (propriedade) => __awaiter(this, void 0, void 0, function* () {
                if (propriedade.startsWith("senha"))
                    objeto[propriedade] = yield Criptografia_1.default.criptografar(objeto[propriedade]);
            }));
            return objeto;
        });
    }
    /**
     *
     * @param array Array<any>
     * @param callback <Function>
     */
    asyncForEach(array, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < array.length; index++) {
                yield callback(array[index], index, array);
            }
        });
    }
    /**
     * Função para utilização de forEach() com async await
     * @param array Array<any> Array a ser percorrido
     * @param funcao <Function> Fução a ser executada em cada item do array
     * @param callback <Function> Função de callback a ser executada após o array ser percorrido
     */
    executeasyncForEach(array, funcao, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.asyncForEach(array, funcao);
            if (callback)
                callback();
        });
    }
}
exports.default = new Util();
