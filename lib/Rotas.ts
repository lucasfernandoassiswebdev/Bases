import { Application } from 'express';

class Rotas {

    public iniciarRotas = async (app: Application, auth: any, rotas: any[]) => {
        await rotas.forEach(async (rota) => {
            rota.exporRotas(app, auth);
        });
    }
}

export default new Rotas();
