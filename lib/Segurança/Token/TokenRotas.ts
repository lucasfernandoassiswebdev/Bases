import { Request, Response } from 'express';
import * as _ from 'lodash';
import Autenticacao from './Autenticacao';

export class TokenRotas {

    /**
     * 
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param servico <any> Classe que extenda Servico<T>
     * @returns <Response> (express)
     */
    auth = async (req: Request, res: Response, servico: any) => {
        const credenciais = {
            email: req.body.email,
            password: req.body.password
        };

        if (credenciais.email) {
            await servico.buscarPorEmail(credenciais.email)
                .then(_.partial(Autenticacao.sucessoAutenticacao, res, credenciais))
                .catch(_.partial(Autenticacao.falhaAutenticacao, req, res));
        }
    };
}

export default new TokenRotas();
