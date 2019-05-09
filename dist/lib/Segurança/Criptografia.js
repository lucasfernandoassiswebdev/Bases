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
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
class Criptografia {
    constructor() {
        /**
         * Retorna o conteúdo passado como parâmetro criptografado
         * @param conteudo <string> conteúdo a ser criptografado
         * @returns Promise<string>
         */
        this.criptografar = (conteudo) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.hashSync(conteudo, 10);
        });
        /**
         * Verifica a compatibilidade entre senha e hash
         * @param senhaCriptografada <string>
         * @param senha <string>
         */
        this.senhaConfere = (senhaCriptografada, senha) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.compareSync(senha, senhaCriptografada);
        });
        /**
         * Descriptografa o conteúdo de um JWT
         * @param conteudo <string> Token
         * @param chaveCriptografia <string> Chave utilizada na criptografia do Token
         */
        this.descriptografarToken = (conteudo, chaveCriptografia) => __awaiter(this, void 0, void 0, function* () {
            return yield jwt.decode(conteudo, chaveCriptografia);
        });
    }
}
exports.default = new Criptografia();
