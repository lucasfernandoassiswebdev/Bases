"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jwt-simple"));
const bcryptjs = __importStar(require("bcryptjs"));
class Criptografia {
    constructor() {
        /**
         * Retorna o conteúdo passado como parâmetro criptografado
         * @param conteudo <string> conteúdo a ser criptografado
         * @returns Promise<string>
         */
        this.criptografar = (conteudo) => __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs.hashSync(conteudo, bcryptjs.genSaltSync(10));
        });
        /**
         * Verifica a compatibilidade entre senha e hash
         * @param senhaCriptografada <string>
         * @param senha <string>
         * @returns <boolean>
         */
        this.hashConfere = (senhaCriptografada, senha) => __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs.compareSync(senha, senhaCriptografada);
        });
        /**
         * Descriptografa o conteúdo de um JWT
         * @param conteudo <string> Token
         * @param chaveCriptografia <string> Chave utilizada na criptografia do Token
         * @returns Promise<string>
         */
        this.descriptografarToken = (conteudo, chaveCriptografia) => __awaiter(this, void 0, void 0, function* () {
            return yield jwt.decode(conteudo, chaveCriptografia);
        });
    }
}
exports.default = new Criptografia();
