import { Application } from 'express';
export default interface RotasInterface {
    /**
     * Interface para as classes que irão expor as rotas necessárias para a API
     * @param app <Application> (express)
     * @param aut <any> opcional, Classe que irá autenticar as rotas quando necessário
     */
    exporRotas(app: Application, aut?: any): void;
    exporControllers(): any[];
}
