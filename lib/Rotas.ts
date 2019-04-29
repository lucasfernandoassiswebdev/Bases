import { Application } from 'express';
import RotasInterface from './RotasInterface';

class Rotas {

    /**
     * Método que percorre e inicia as rotas da API
     * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
     * @param aut <any> Classe que irá autenticar as rotas necessárias
     * @param rotas <any[]> Classes rotas que expõe/mapeam as rotas na APi
     * @param conexao <any> Conexão com o banco
     */
    public iniciarRotas = async (app: Application, aut: any, rotas: RotasInterface[], conexao: any) => {
        for (let item of rotas) {
            item.exporRotas(app, aut, conexao);
        }

        // await rotas.forEach(async (rota) => {
        //     rota.exporRotas(app, aut, conexao);
        // });
    }
}

export default new Rotas();
