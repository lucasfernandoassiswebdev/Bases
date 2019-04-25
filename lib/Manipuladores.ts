import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import * as HttpStatus from 'http-status';
import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';

class Manipuladores {

    falhaAutenticacao(req: Request, res: Response) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    sucessoAutenticacao(res: Response, credentials: any, data: any) {
        const senhaBate = bcrypt.compareSync(credentials.password, data.password);
        if (senhaBate) {
            const payload = { id: data.id };
            res.json({
                token: jwt.encode(payload, 'S3CR37')
            });
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }

    erro(res: Response, message: String, err: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ payload: err });
    }

    sucesso(res: Response, data: any) {
        res.status(HttpStatus.OK).json({ result: data });
    }

    manipuladorErroApi(err: ErrorRequestHandler, req: Request, res: Response, next?: NextFunction) {
        console.error(`API error handler foi executado: ${err}`);
        res.status(500).json({
            errorCode: 'ERR-001',
            message: 'Erro interno do servidor'
        });

        if (next)
            next();
    }

    manipuladorErroDB(res: Response, err: any) {
        console.log(`Um erro aconteceu ${err}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'ERR-02',
            message: 'DB Error'
        });
    }
}

export default new Manipuladores();