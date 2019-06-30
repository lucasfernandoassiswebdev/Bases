import { Application } from 'express';
import { RotasInterface } from '../../../bin/BaseModule';
export default class TokenRotas implements RotasInterface {
    private servico;
    private chaveCriptografia;
    private paramName?;
    constructor(servico: any, chaveCriptografia: string, paramName?: string);
    /**
     * Método que autentica as rotas necessárias
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param servico <any> Classe que extenda Servico<T> deve obrigatoriamente ter o método "buscarUsuario"
     * @returns <Response> (express)
     */
    private auth;
    exporRotas(app: Application): void;
    exporControllers(): any[];
}
