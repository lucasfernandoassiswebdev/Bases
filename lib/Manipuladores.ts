import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import HttpStatus from 'http-status';

class Manipuladores {

    /**
     * 
     * @param res <Response> (express)
     * @param message <string>
     * @param err <any>
     * @returns Status 500 - Internal Server Error
     */
    public erro(res: Response, message?: string, err?: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: message,
            payload: err
        });
    }

    /**   
     *  
     * @param res <Response> (express)
     * @param data <any> Dados que serão retornados no corpo da resposta na propriedade "result"
     * @returns Status 200 - OK
     */
    public sucesso(res: Response, data: any) {
        res.status(HttpStatus.OK).json({ result: data });
    }

    /**
     * 
     * @param err <ErrorRequestHandler>
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param next <NextFunction>
     */
    public manipuladorErroApi(erro: ErrorRequestHandler, req: Request, res: Response, next?: NextFunction) {
        console.error(`API error handler foi executado: ${erro}`);
        res.status(500).json({
            errorCode: 'ERR-001',
            message: `Erro interno do servidor\n${erro}`
        });

        if (next)
            next();
    }

    /**
     * 
     * @param res <Response> (express)
     * @param err <any>
     */
    public manipuladorErroDB(res: Response, erro: any) {
        console.log(`DB error handler foi executado: ${erro}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'ERR-02',
            message: `DB Error\n${erro}`
        });
    }
}

export default new Manipuladores();
