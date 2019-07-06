import { Request, Response } from 'express';
import _ from 'lodash';
import Manipuladores from '../Manipuladores';
import Servico from './Servico';
import Util from '../Util/Util';
import HttpStatus from 'http-status';

export interface IController {
    buscar(req: Request, res: Response): any;
    buscarUm(req: Request, res: Response): any;
    buscarPorId(req: Request, res: Response): any;
    buscarTodos(req: Request, res: Response): any;
    salvar(req: Request, res: Response): any;
    salvarLista(req: Request, res: Response): any;
    remover(req: Request, res: Response): any;
    removerObjeto(req: Request, res: Response): any;
}

export default abstract class Controller<T> implements IController {

    /**
     * 
     * @param servico Servico<T> Serviço correspondente a classe do módulo
     */
    constructor(public servico: Servico<T>, public paramName?: string) { }

    /**
     * Inicia o Repositório de acordo com T
     */
    public iniciarRepositorio(): void {
        this.servico.iniciarRepositorio();
    }

    /**
     * Filtro avançado, utiliza os parâmetros da query string
     * É necessário passar nos parâmetros da url página e limite, ambos do tipo <number>
     * Caso não fornecidos, assumem os valores 0 e 100 respectivamente como default
     * @param <Request> (express) 
     * @param <Response> (express)
     */
    public filtrar = async (req: Request, res: Response) => {
        let pagina: number = req.params.pagina ? Number.parseInt(req.params.pagina) : 0;
        let limite: number = req.params.limite ? Number.parseInt(req.params.limite) : 100;
        let parametros: any = req.query;

        if (Object.entries(parametros).length === 0 && parametros.constructor === Object)
            Manipuladores.erro(res, "Nenhum parâmetro foi fornecido na query string");

        await this.servico.filtrar(pagina, limite, parametros)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao buscar dados"));
    }

    /**
     * Deve conter uma QueryString(URL) com os dados para a busca
     * @param req <Request> (express) 
     * @param res <Response> (express)
     * @returns Lista de objetos encontrados de acordo com os parâmetros fornecidos
     */
    public buscar = async (req: Request, res: Response) => {
        await this.servico.buscar(req.query, undefined, req.params.pagina, req.params.limite)
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
            Manipuladores.erro(res, "Parâmetro necessário(id) não foi fornecido");

        let id = Number.parseInt(req.params.id);

        await this.servico.buscarPorId(id, this.paramName)
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
            Manipuladores.erro(res, "Parâmetros necessários(pagina e limite) não foram fornecidos");

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
        if (!Object.entries(req.body).length) {
            Manipuladores.erro(res, 'É necessário fornecer um objeto no corpo da requisição');
            return;
        }

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
        if (!Object.entries(req.body).length) {
            Manipuladores.erro(res, 'É necessário fornecer uma objeto no corpo da requisição');
            return;
        }

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
            Manipuladores.erro(res, "Parâmetro necessário(id) não foram fornecido");

        let id = Number.parseInt(req.params.id);

        try {
            let objetoRemovido = await this.servico.remover(id, this.paramName);

            if (objetoRemovido != undefined)
                Manipuladores.sucesso(res, objetoRemovido);
            else
                Manipuladores.erro(res, "Não foi encontrado objeto de acordo com os parâmetros fornecidos", null, HttpStatus.NOT_FOUND);
        } catch (error) {
            Manipuladores.erro(res, "Erro ao remover dados fornecidos", error);
        }
    }

    /**
     * Remove o objeto passado no corpo da requisição(utilize o verbo HTTP POST)
     * @param req <Request> (express)
     * @param res <Response> (express)     
     */
    public removerObjeto = async (req: Request, res: Response) => {
        if (!Object.entries(req.body).length) {
            Manipuladores.erro(res, "Objeto a ser removido não foi encontrado no corpo da requisição");
            return;
        }

        let objeto: T = req.body;

        await this.servico.removerObjeto(objeto)
            .then(_.partial(Manipuladores.sucesso, res))
            .catch(_.partial(Manipuladores.erro, res, "Erro ao remover dados fornecidos"));
    }
}
