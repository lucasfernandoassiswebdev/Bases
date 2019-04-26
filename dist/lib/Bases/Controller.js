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
const _ = require("lodash");
const Manipuladores_1 = require("../Manipuladores");
class Controller {
    /**
     *
     * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
     * @param servico Servico<T>
     * @param rotaBase <string>
     * @param auth <any> Classe que irá autenticar as rotas quando necessário
     */
    obterRotas(app, servico, rotaBase, auth) {
        app.route(`/$${rotaBase}/buscar`).all(auth.authenticate()).get((req, res) => __awaiter(this, void 0, void 0, function* () {
            servico.buscar(req.params)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        }));
        app.route(`/$${rotaBase}/buscarUm`).all(auth.authenticate()).get((req, res) => {
            servico.buscarUm(req.params)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        app.route(`/$${rotaBase}/buscarPorId/:id`).all(auth.authenticate()).get((req, res) => {
            let id = Number.parseInt(req.params.id);
            servico.buscarPorId(id)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        app.route(`/$${rotaBase}/:pagina/:limite`).all(auth.authenticate()).get((req, res) => {
            let pagina = Number.parseInt(req.params.pagina);
            let limite = Number.parseInt(req.params.limite);
            servico.buscarTodos(pagina, limite)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro ao buscar dados"));
        });
        app.route(`/$${rotaBase}/salvar`).all(auth.authenticate()).post((req, res) => {
            servico.salvar(req.body)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro salvar dados"));
        });
        app.route(`/$${rotaBase}/atualizar`).all(auth.authenticate()).put((req, res) => {
            servico.salvar(req.body)
                .then(_.partial(Manipuladores_1.default.sucesso, res))
                .catch(_.partial(Manipuladores_1.default.erro, res, "Erro atualizar dados"));
        });
        app.route(`/$${rotaBase}/:id`).all(auth.authenticate()).delete((req, res) => {
            try {
                let id = Number.parseInt(req.params.id);
                servico.remover(id);
                res.status(204).send();
            }
            catch (e) {
                _.partial(Manipuladores_1.default.erro, res, "Erro excluir dados");
            }
        });
    }
}
exports.default = Controller;
