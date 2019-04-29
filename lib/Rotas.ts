import { Application } from 'express';

class Rotas {

    /**
     * Método que percorre e inicia as rotas da API
     * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
     * @param auth <any> Classe que irá autenticar as rotas necessárias
     * @param rotas <any[]> Classes rotas que expõe/mapeam as rotas na APi
     */
    public iniciarRotas = async (app: Application, auth: any, rotas: any[]) => {
        await rotas.forEach(async (rota) => {
            rota.exporRotas(app, auth);
        });
    }
}

export default new Rotas();
