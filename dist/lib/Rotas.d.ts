import RotasInterface from './RotasInterface';
declare class Rotas {
    /**
     * Método que percorre e inicia as rotas da API
     * @param app <Application> (express) Aplicação onde as rotas serão mapeadas
     * @param aut <any> Classe que irá autenticar as rotas necessárias
     * @param rotas <RotasInterface[]> Classes rotas que expõe/mapeam as rotas na APi
     */
    iniciarRotas: (app: any, aut: any, rotas: RotasInterface[]) => Promise<void>;
}
declare const _default: Rotas;
export default _default;
