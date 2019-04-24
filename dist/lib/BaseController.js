"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Handlers_1 = require("./Handlers");
class BaseController {
    constructor(service) {
        this.service = service;
        this.get = (req, res) => {
            this.service.get(req.params)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.getOne = (req, res) => {
            this.service.getOne(req.params)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.getById = (req, res) => {
            this.service.getById(req.params.id)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.getAll = (req, res) => {
            this.service.getAll()
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro ao buscar dados"));
        };
        this.create = (req, res) => {
            this.service.create(req.body)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro salvar dados"));
        };
        this.update = (req, res) => {
            this.service.update(req.body)
                .then(_.partial(Handlers_1.default.onSuccess, res))
                .catch(_.partial(Handlers_1.default.onError, res, "Erro atualizar dados"));
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
