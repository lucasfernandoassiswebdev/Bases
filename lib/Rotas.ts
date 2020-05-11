import { Application } from 'express';
import RotasInterface from './RotasInterface';
import Controller from './Bases/Controller';

class Rotas {

    /**
     * Método que percorre e inicia as rotas da API
     * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
     * @param aut <any> Classe que irá autenticar as rotas necessárias
     * @param rotas <RotasInterface[]> Classes rotas que expõe/mapeam as rotas na APi     
     */
    public iniciarRotas = async (app: Application, aut: any, rotas: RotasInterface[]) => {
        await rotas.forEach(async (rota) => {
            rota.exporRotas(app, aut);
            rota.exporControllers().forEach((controller: any) => {
                if (controller instanceof Controller)
                    controller.iniciarRepositorio();
            });
        });
    }
}

export default new Rotas();
