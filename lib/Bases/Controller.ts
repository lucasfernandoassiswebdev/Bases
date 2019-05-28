import { Request, Response } from 'express';
import _ from 'lodash';
import Manipuladores from '../Manipuladores';
import Servico from './Servico';
import Util from '../Util/Util';

export interface IController {
    buscar(req: Request, res: Response): any;
    buscarUm(req: Request, res: Response): any;
    buscarPorId(req: Request, res: Response): any;
    buscarTodos(req: Request, res: Response): any;
    salvar(req: Request, res: Response): any;
    salvarLista(req: Request, res: Response): any;
    remover(req: Request, res: Response): any;
}

export default abstract class Controller<T> implements IController {

    /**
     * 
     * @param servico Servico<T> Serviço correspondente a classe do módulo
     */
    constructor(public servico: Servico<T>) { }

    /**
     * Inicia o Repositório de acordo com T
     */
    public iniciarRepositorio(): void {
        this.servico.iniciarRepositorio();
    }

    /**
     * Deve conter uma QueryString(URL) com os dados para a busca
     * @param req <Request> (express) 
     * @param res <Response> (express)
     * @returns Lista de objetos encontrados de acordo com os parâmetros fornecidos
     */
    public buscar = async (req: Request, res: Response) => {
        await this.servico.buscar(req.query)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
    }

    /**
     * Deve conter uma QueryString(URL) com os dados para a busca
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Promise<T> Primeiro objeto encontrado de acordo com os parâmetros fornecidos
     */
    public buscarUm = async (req: Request, res: Response) => {
        await this.servico.buscarUm(req.params)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
    }

    /**
     * Deve conter na URL o parâmetro "ID" para a busca do objeto desejado
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Promise<T> Objeto com o ID informado
     */
    public buscarPorId = async (req: Request, res: Response) => {
        if (!req.params.id)
            _.partial(Manipuladores.erro, res, "Parâmetro necessário(id) não foi fornecido");

        let id = Number.parseInt(req.params.id);

        await this.servico.buscarPorId(id)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
    }

    /**
     * Busca todos os objetos na página desejada
     * É necessário fornecer na URL os parâmetros de página e limite
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Promise<T[]> Retorna os objetos encontrados na página informada
     */
    public buscarTodos = async (req: Request, res: Response) => {
        if (!req.params.pagina || !req.params.limite)
            _.partial(Manipuladores.erro, res, "Parâmetros necessários(pagina e limite) não foram fornecidos");

        let pagina = Number.parseInt(req.params.pagina);
        let limite = Number.parseInt(req.params.limite);

        await this.servico.buscarTodos(pagina, limite)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
    }

    /**
     * Salva o objeto<T> passado no corpo da requisição     
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns <T> Retorna os dados do objeto criado
     */
    public salvar = async (req: Request, res: Response) => {
        req.body = await Util.criptografaSenhas(req.body);

        await this.servico.salvar(req.body)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao salvar dados fornecidos"));
    }

    /**
     * Salva a lista de objetos<T[]> passados no corpo da requisição
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns <T[]> Retorna a lista de dados dos objetos criados
     */
    public salvarLista = async (req: Request, res: Response) => {
        await req.body.forEach(async (item: T) => {
            item = await Util.criptografaSenhas(item);
        });

        await this.servico.salvarLista(req.body)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao salvar lista de dados fornecidos"));
    }

    /**
     * Remove o objeto do ID passado como parâmetro na URL
     * @param req <Request> (express)
     * @param res <Response> (express)     
     */
    public remover = async (req: Request, res: Response) => {
        if (!req.params.id)
            _.partial(Manipuladores.erro, res, "Parâmetro necessário(id) não foram fornecido");

        let id = Number.parseInt(req.params.id);

        await this.servico.remover(id)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao remover dados fornecidos"));
    }    
}
