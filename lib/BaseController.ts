import { Request, Response } from 'express';
import * as _ from 'lodash';
import Handlers from './Handlers';
import { BaseService } from './BaseService';

export interface IController {
    find(req: Request, res: Response);    
    findById(req: Request, res: Response);
    findAll(req: Request, res: Response);
    save(req: Request, res: Response);    
    delete(req: Request, res: Response);
}

export class BaseController<T> implements IController {

    constructor(private service: BaseService<T>) { }

    find = (req: Request, res: Response) => {
        this.service.find(req.params)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }  

    findById = (req: Request, res: Response) => {
        this.service.findById(req.params.id)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }

    findAll = (req: Request, res: Response) => {
        this.service.findAll(req.params.pagina, req.params.limite)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro ao buscar dados"));
    }

    save = (req: Request, res: Response) => {
        this.service.save(req.body)
            .then(_.partial(Handlers.onSuccess, res))
            .catch(_.partial(Handlers.onError, res, "Erro salvar dados"));
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
