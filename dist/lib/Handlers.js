"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
class Handlers {
    authFail(req, res) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    authSuccess(res, credentials, data) {
        const isMatch = bcrypt.compareSync(credentials.password, data.password);
        if (isMatch) {
            const payload = { id: data.id };
            res.json({
                token: jwt.encode(payload, 'S3CR37')
            });
        }
        else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }
    onError(res, message, err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ payload: err });
    }
    onSuccess(res, data) {
        res.status(HttpStatus.OK).json({ result: data });
    }
    errorHandlerApi(err, req, res, next) {
        console.error(`API error handler foi executado: ${err}`);
        res.status(500).json({
            errorCode: 'ERR-001',
            message: 'Erro interno do servidor'
        });
    }
    dbErrorHandler(res, err) {
        console.log(`Um erro aconteceu ${err}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'ERR-02',
            message: 'Erro ao criar usuário'
        });
    }
}
exports.default = new Handlers();
