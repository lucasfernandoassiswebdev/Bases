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
class Rotas {
    constructor() {
        /**
         * Método que percorre e inicia as rotas da API
         * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
         * @param aut <any> Classe que irá autenticar as rotas necessárias
         * @param rotas <RotasInterface[]> Classes rotas que expõe/mapeam as rotas na APi
         * @param conexao <any> Conexão com o banco
         */
        this.iniciarRotas = (app, aut, rotas, conexao) => __awaiter(this, void 0, void 0, function* () {
            yield rotas.forEach((rota) => __awaiter(this, void 0, void 0, function* () {
                rota.exporRotas(app, aut, conexao);
            }));
        });
    }
}
exports.default = new Rotas();
