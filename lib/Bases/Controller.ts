import { Request, Response, Application } from 'express';
import * as _ from 'lodash';
import Manipuladores from '../Manipuladores';
import { Servico } from './Servico';

export interface IController<T> {
    obterRotas(app: ApplicationCache, servico: Servico<T>, rotaBase: string, auth: any): void;
}

export default class Controller<T> implements IController<T> {

    /**
     * 
     * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
     * @param servico Servico<T> 
     * @param rotaBase <string> 
     * @param auth <any> Classe que irá autenticar as rotas quando necessário
     */
    public obterRotas(app: Application, servico: Servico<T>, rotaBase: string, auth: any): void {
        app.route(`/$${rotaBase}/buscar`).all(auth.authenticate()).get(async (req: Request, res: Response) => {
            servico.buscar(req.params)
                .then(_.partial(Manipuladores.sucesso, res))
                .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
        });

        app.route(`/$${rotaBase}/buscarUm`).all(auth.authenticate()).get((req: Request, res: Response) => {
            servico.buscarUm(req.params)
                .then(_.partial(Manipuladores.sucesso, res))
                .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
        });

        app.route(`/$${rotaBase}/buscarPorId/:id`).all(auth.authenticate()).get((req: Request, res: Response) => {
            let id = Number.parseInt(req.params.id);

            servico.buscarPorId(id)
                .then(_.partial(Manipuladores.sucesso, res))
                .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
        });

        app.route(`/$${rotaBase}/:pagina/:limite`).all(auth.authenticate()).get((req: Request, res: Response) => {
            let pagina = Number.parseInt(req.params.pagina);
            let limite = Number.parseInt(req.params.limite);

            servico.buscarTodos(pagina, limite)
                .then(_.partial(Manipuladores.sucesso, res))
                .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
        });

        app.route(`/$${rotaBase}/salvar`).all(auth.authenticate()).post((req: Request, res: Response) => {
            servico.salvar(req.body)
                .then(_.partial(Manipuladores.sucesso, res))
                .catch(_.partial(Manipuladores.erro, res, "Erro salvar dados"));
        });

        app.route(`/$${rotaBase}/atualizar`).all(auth.authenticate()).put((req: Request, res: Response) => {
            servico.salvar(req.body)
                .then(_.partial(Manipuladores.sucesso, res))
                .catch(_.partial(Manipuladores.erro, res, "Erro atualizar dados"));
        });

        app.route(`/$${rotaBase}/:id`).all(auth.authenticate()).delete((req: Request, res: Response) => {
            try {
                let id = Number.parseInt(req.params.id);
                servico.remover(id);
                res.status(204).send();
            } catch (e) {
                _.partial(Manipuladores.erro, res, "Erro excluir dados");
            }
        });
    }
}