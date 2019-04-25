import { Request, Response } from 'express';
import * as _ from 'lodash';
import Handlers from '../Manipuladores';

export class TokenRotas {

    /** O Service a ser passado deve ter a função buscarPorEmail obrigatoriamente */
    auth = async (req: Request, res: Response, service: any) => {
        const credenciais = {
            email: req.body.email,
            password: req.body.password
        };

        if (credenciais.email) {
            await service.buscarPorEmail(credenciais.email)
                .then(_.partial(Handlers.sucessoAutenticacao, res, credenciais))
                .catch(_.partial(Handlers.falhaAutenticacao, req, res));
        }
    };
}

export default new TokenRotas();
