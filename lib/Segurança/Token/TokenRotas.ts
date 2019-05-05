import { Application, Request, Response } from 'express';
import * as _ from 'lodash';
import Autenticacao from './Autenticacao';
import { RotasInterface } from '../../../bin/BaseModule';

export default class TokenRotas implements RotasInterface {

    constructor(private servico: any, private chaveCriptografia: string) { }

    /**
     * Método que autentica as rotas necessárias
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param servico <any> Classe que extenda Servico<T>
     * @returns <Response> (express)
     */
    auth = async (req: Request, res: Response) => {
        const credenciais = {
            email: req.body.email,
            senha: req.body.senha
        };

        if (credenciais.email) {
            await this.servico.buscarPorEmail(credenciais.email)
                .then((usuario: any) => Autenticacao.sucessoAutenticacao(res, credenciais.senha, usuario, this.chaveCriptografia))
                .catch(_.partial(Autenticacao.falhaAutenticacao, req, res));
        }
    };

    public exporRotas(app: Application, aut: any): void {
        app.route('/token').post(this.auth);
    }
}
