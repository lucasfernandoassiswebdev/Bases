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
     * @param servico <any> Classe que extenda Servico<T> deve obrigatoriamente ter o método "buscarUsuario"
     * @returns <Response> (express)
     */
    private auth = async (req: Request, res: Response) => {
        const credenciais = req.body;

        if (Object.entries(credenciais).length !== 0 && credenciais.constructor !== Object)
            _.partial(Autenticacao.autenticacaoIrregular, req, res, 'Corpo da requisição vazio');
        else if (!credenciais.senha)
            _.partial(Autenticacao.autenticacaoIrregular, req, res, 'É necessário que o corpo da requisição tenha o parâmetro \"senha\" fornecido para gerar o Token.');
        else
            await this.servico.buscarUsuario(credenciais)
                .then((usuario: any) => Autenticacao.sucessoAutenticacao(res, credenciais.senha, usuario, this.chaveCriptografia))
                .catch(_.partial(Autenticacao.falhaAutenticacao, req, res));
    };

    public exporRotas(app: Application): void {
        app.route('/token').post(this.auth);
    }

    public exporControllers(): any[] {
        return [];
    }
}
