import { Application } from 'express';

export default interface RotasInterface {
    exporRotas(app: Application, aut: any, conexao?: any): void;
}