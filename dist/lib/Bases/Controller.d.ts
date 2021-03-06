import { Request, Response } from 'express';
import Servico from './Servico';
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
    servico: Servico<T>;
    paramName?: string;
    /**
     *
     * @param servico Servico<T> Serviço correspondente a classe do módulo
     */
    constructor(servico: Servico<T>, paramName?: string);
    /**
     * Inicia o Repositório de acordo com T
     */
    iniciarRepositorio(): void;
    /**
     * Filtro avançado, utiliza os parâmetros da query string
     * É necessário passar nos parâmetros da url página e limite, ambos do tipo <number>
     * Caso não fornecidos, assumem os valores 0 e 100 respectivamente como default
     * @param <Request> (express)
     * @param <Response> (express)
     */
    filtrar: (req: Request, res: Response) => Promise<void>;
    /**
     * Deve conter uma QueryString(URL) com os dados para a busca
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Lista de objetos encontrados de acordo com os parâmetros fornecidos
     */
    buscar: (req: Request, res: Response) => Promise<void>;
    /**
     * Deve conter uma QueryString(URL) com os dados para a busca
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Promise<T> Primeiro objeto encontrado de acordo com os parâmetros fornecidos
     */
    buscarUm: (req: Request, res: Response) => Promise<void>;
    /**
     * Deve conter na URL o parâmetro "ID" para a busca do objeto desejado
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Promise<T> Objeto com o ID informado
     */
    buscarPorId: (req: Request, res: Response) => Promise<void>;
    /**
     * Busca todos os objetos na página desejada
     * É necessário fornecer na URL os parâmetros de página e limite
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns Promise<T[]> Retorna os objetos encontrados na página informada
     */
    buscarTodos: (req: Request, res: Response) => Promise<void>;
    /**
     * Salva o objeto<T> passado no corpo da requisição
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns <T> Retorna os dados do objeto criado
     */
    salvar: (req: Request, res: Response) => Promise<void>;
    /**
     * Salva a lista de objetos<T[]> passados no corpo da requisição
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @returns <T[]> Retorna a lista de dados dos objetos criados
     */
    salvarLista: (req: Request, res: Response) => Promise<void>;
    /**
     * Remove o objeto do ID passado como parâmetro na URL
     * @param req <Request> (express)
     * @param res <Response> (express)
     */
    remover: (req: Request, res: Response) => Promise<void>;
    /**
     * Remove o objeto passado no corpo da requisição(utilize o verbo HTTP POST)
     * @param req <Request> (express)
     * @param res <Response> (express)
     */
    removerObjeto: (req: Request, res: Response) => Promise<void>;
}
