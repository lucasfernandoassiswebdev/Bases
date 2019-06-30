import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
declare class Manipuladores {
    /**
     *
     * @param res <Response> (express)
     * @param message <string>
     * @param err <any>
     * @param status <number> default -> 500(Internal Server Error)
     * @returns Status 500 - Internal Server Error
     */
    erro(res: Response, message?: string, err?: any, status?: number): void;
    /**
     *
     * @param res <Response> (express)
     * @param data <any> Dados que serão retornados no corpo da resposta na propriedade "result"
     * @returns Status 200 - OK
     */
    sucesso(res: Response, data: any): void;
    /**
     *
     * @param err <ErrorRequestHandler>
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param next <NextFunction>
     */
    manipuladorErroApi(erro: ErrorRequestHandler, req: Request, res: Response, next?: NextFunction): void;
    /**
     *
     * @param res <Response> (express)
     * @param err <any>
     */
    manipuladorErroDB(res: Response, erro: any): void;
}
declare const _default: Manipuladores;
export default _default;
