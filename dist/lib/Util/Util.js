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
        /**
         * Validador de CPF
         * @param cpf <string> CPF a ser verificado
         * @returns <boolean>
         */
        this.isCpfValido = (cpf) => {
            let soma = 0;
            let resto;
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf == '' || cpf.length != 11 || cpf == '00000000000'
                || cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333'
                || cpf == '44444444444' || cpf == '55555555555' || cpf == '66666666666'
                || cpf == '77777777777' || cpf == '88888888888' || cpf == '99999999999')
                return false;
            for (let i = 1; i <= 9; i++) {
                soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }
            resto = (soma * 10) % 11;
            if ((resto == 10) || (resto == 11))
                resto = 0;
            if (resto != parseInt(cpf.substring(9, 10)))
                return false;
            soma = 0;
            for (let i = 1; i <= 10; i++) {
                soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }
            resto = (soma * 10) % 11;
            if ((resto == 10) || (resto == 11))
                resto = 0;
            if (resto != parseInt(cpf.substring(10, 11)))
                return false;
            return true;
        };
        /**
         * Validador de CNPJ
         * @param cnpj <string> CNPJ a ser verificado
         * @returns <boolean>
         */
        this.icCnpjValido = (cnpj) => {
            cnpj = cnpj.replace(/[^\d]+/g, '');
            if (cnpj == '' || cnpj.length != 14)
                return false;
            if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" ||
                cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" ||
                cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" ||
                cnpj == "99999999999999")
                return false;
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0, tamanho);
            let digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != Number.parseInt(digitos.charAt(0)))
                return false;
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != Number.parseInt(digitos.charAt(1)))
                return false;
            return true;
        };
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
