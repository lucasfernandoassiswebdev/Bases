"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status");
class Manipuladores {
    /**
     *
     * @param res <Response> (express)
     * @param message <string>
     * @param err <any>
     * @returns Status 500 - Internal Server Error
     */
    erro(res, message, err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ payload: err });
    }
    /**
     *
     * @param res <Response> (express)
     * @param data <any> Dados que serão retornados no corpo da resposta na propriedade "result"
     * @returns Status 200 - OK
     */
    sucesso(res, data) {
        res.status(HttpStatus.OK).json({ result: data });
    }
    /**
     *
     * @param err <ErrorRequestHandler>
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param next <NextFunction>
     */
    manipuladorErroApi(erro, req, res, next) {
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
    manipuladorErroDB(res, erro) {
        console.log(`DB error handler foi executado: ${erro}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'ERR-02',
            message: `DB Error\n${erro}`
        });
    }
}
exports.default = new Manipuladores();
