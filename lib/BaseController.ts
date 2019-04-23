import { Request, Response } from 'express';
import * as _ from 'lodash';
import Handlers from './Handlers';
import { BaseService } from './BaseService';

export interface IController {
    get(req: Request, res: Response);
    getOne(req: Request, res: Response);
    getAll(req: Request, res: Response);
    create(req: Request, res: Response);
    update(req: Request, res: Response);
    delete(req: Request, res: Response);
}

export class BaseController<T> implements IController {

    constructor(private service: BaseService<T>) { }

    get = (req: Request, res: Response) => {
        this.service.get(req.params)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }

    getOne = (req: Request, res: Response) => {
        this.service.getOne(req.params)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }

    getById = (req: Request, res: Response) => {
        this.service.getById(req.params.id)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }

    getAll = (req: Request, res: Response) => {
        this.service.getAll()
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }

    create = (req: Request, res: Response) => {
        this.service.create(req.body)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro salvar dados"));
    }

    update = (req: Request, res: Response) => {
        this.service.update(req.body)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro atualizar dados"));
    }

    delete = (req: Request, res: Response) => {
        try {
            this.service.delete(req.params.id);
            res.status(204).send();
        } catch (e) {
            _.partial(Handlers.onError, res, "Erro excluir dados");
        }
    }
}
