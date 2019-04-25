"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Handlers_1 = require("./Handlers");
class BaseController {
    constructor(service) {
        this.service = service;
        this.find = (req, res) => {
            this.service.find(req.params)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.findOne = (req, res) => {
            this.service.findOne(req.params)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.findById = (req, res) => {
            this.service.findById(req.params.id)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.findAll = (req, res) => {
            let pagina = Number.parseInt(req.params.pagina);
            let limite = Number.parseInt(req.params.limite);
            this.service.findAll(pagina, limite)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.save = (req, res) => {
            this.service.save(req.body)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro salvar dados"));
        };
        this.delete = (req, res) => {
            try {
                this.service.delete(req.params.id);
                res.status(204).send();
            }
            catch (e) {
                _.partial(Handlers_1.default.onError, res, "Erro excluir dados");
            }
        };
    }
}
exports.BaseController = BaseController;
