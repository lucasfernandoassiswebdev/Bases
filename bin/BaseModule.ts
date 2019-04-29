import Autenticacao from '../lib/Segurança/Token/Autenticacao';
import Criptografia from '../lib/Segurança/Criptografia';
import Controller from '../lib/Bases/Controller';
import Manipuladores from '../lib/Manipuladores';
import Pagina from '../lib/Pagina';
import { Repositorio } from '../lib/Bases/Repositorio';
import { RepositorioMongo } from '../lib/Bases/RepositorioMongo';
import Rotas from '../lib/Rotas';
import { Servico } from '../lib/Bases/Servico';
import { ServicoMongo } from '../lib/Bases/ServicoMongo';
import TokenRotas from '../lib/Segurança/Token/TokenRotas';

export default {
    Autenticacao,
    Criptografia,
    Controller,
    Manipuladores,
    Pagina,
    Rotas,
    Repositorio,
    RepositorioMongo,
    Servico,
    ServicoMongo,
    TokenRotas
}