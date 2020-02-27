"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Pagina_1 = __importDefault(require("../Pagina"));
class Repositorio {
    /**
     * Inicia a classe criando o repositório da classe genérica informada
     * @param classeEntidade <any> classe do Repositório
     */
    constructor(classeEntidade) {
        this.classeEntidade = classeEntidade;
        this.pagina = new Pagina_1.default();
    }
    /**
     * Inicia a variável repositório
     */
    iniciarRepositorio() {
        this.repositorio = typeorm_1.getRepository(this.classeEntidade);
    }
    /**
     *
     * @param objeto <T> Objeto a ser salvo
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto criado
     */
    salvar(objeto, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield typeof transacao) !== 'undefined'
                ? transacao.save(objeto)
                : this.repositorio.save(objeto);
        });
    }
    /**
     * Retorna uma página com os dados resultantes da busca de acordo com os parâmetros fornecidos
     * @param pagina <number>
     * @param limite <number>
     * @param parametros <any> Objeto com os dados a serem utilizados na busca
     */
    filtrar(pagina, limite, parametros) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number.isInteger(pagina))
                    pagina = Math.ceil(pagina);
                if (!Number.isInteger(limite))
                    limite = Math.ceil(limite);
                let filtros = '';
                //Verifica Todos os parâmetros passados
                let tabelas = new Map();
                let relation = [];
                let ordena = {};
                for (var propName in parametros) {
                    if (parametros.hasOwnProperty(propName)) {
                        if (propName != 'relations' && propName != 'orderBy') {
                            //$ é caractere especial indicando inicio de condição para o campo
                            let field_cond = propName.split('$');
                            let condicao = '=';
                            //posição 0 - campo, 1 - condição
                            let field = field_cond[0];
                            let tabela_field = field.split('.');
                            let letra = 97; // 97 = 'a'
                            if (tabela_field.length > 1) {
                                for (var i = 0; i < tabela_field.length - 1; i++) {
                                    let busca = String.fromCharCode(letra) + '.' + tabela_field[i];
                                    if (typeof tabelas.get(busca) === 'undefined') {
                                        letra = 97 + tabelas.size;
                                        tabelas.set(busca, String.fromCharCode(++letra));
                                    }
                                    else
                                        letra = tabelas.get(busca).charCodeAt(0);
                                }
                                field = tabela_field[tabela_field.length - 1];
                            }
                            if (field_cond.length > 1) {
                                switch (field_cond[1]) {
                                    case 'like':
                                        condicao = 'like';
                                        break;
                                    case 'gt':
                                        condicao = '>';
                                        break;
                                    case 'ge':
                                        condicao = '>=';
                                        break;
                                    case 'lt':
                                        condicao = '<';
                                        break;
                                    case 'le':
                                        condicao = '<=';
                                        break;
                                    case 'ne':
                                        condicao = '<>';
                                        break;
                                    case 'null':
                                        condicao = 'is null';
                                        break;
                                    case 'not_null':
                                        condicao = 'is not null';
                                        break;
                                    case 'in':
                                        condicao = 'in';
                                        break;
                                    case 'not_in':
                                        condicao = 'not in';
                                        break;
                                }
                                if (field_cond[1] == 'like')
                                    condicao = 'like';
                            }
                            //Verifica na metadata da tabela se o campo existe
                            let encontrou = false;
                            if (tabelas.size > 0)
                                encontrou = true;
                            else
                                for (let i = 0; i < this.repositorio.metadata.columns.length; i++) {
                                    if (this.repositorio.metadata.columns[i].databaseNameWithoutPrefixes == field) {
                                        encontrou = true;
                                        break;
                                    }
                                }
                            //Se não encontrar retorna erro e indica campos válidos
                            if (encontrou == false) {
                                let erro = 'Campo de busca inválido: ' + field + '\n\nCampos válidos (exceto joins):\n';
                                for (var i = 0; i < this.repositorio.metadata.columns.length; i++) {
                                    erro += this.repositorio.metadata.columns[i].databaseNameWithoutPrefixes + '\n';
                                }
                                console.error(erro);
                                return null;
                            }
                            //monta o filtro
                            if (filtros == '')
                                filtros = '';
                            else
                                filtros += ' and ';
                            if (tabela_field.length > 1)
                                filtros += String.fromCharCode(letra) + '.';
                            else
                                filtros += 'a.';
                            filtros += field + ' ' + condicao + (parametros[propName] != '' ? condicao == 'in' || condicao == 'not in' ? ' (' + parametros[propName].replace(/%20/g, " ") + ')' : ' \'' + parametros[propName].replace(/%20/g, " ") + '\'' : '');
                        }
                        else if (propName == 'relations') {
                            let aux = parametros[propName].split(',');
                            for (var i = 0; i < aux.length; i++) {
                                relation.push(aux[i]);
                            }
                        }
                        else if (propName == 'orderBy') {
                            let aux = parametros[propName].split(',');
                            for (var i = 0; i < aux.length; i++) {
                                let ordem = aux[i].split('$');
                                let opcao = "ASC";
                                if (ordem.length > 1) {
                                    opcao = ordem[1];
                                }
                                ordena[ordem[0]] = opcao;
                            }
                        }
                    }
                }
                limite = limite > 100 || limite <= 0 ? 100 : limite;
                pagina = pagina <= 0 ? 0 : (pagina - 1) * limite;
                let joins = {};
                for (let key of Array.from(tabelas.keys())) {
                    let campo = tabelas.get(key);
                    joins[campo] = key;
                }
                let [result, count] = yield this.repositorio.findAndCount({
                    skip: pagina,
                    take: limite,
                    where: filtros,
                    relations: relation,
                    order: ordena,
                    join: {
                        alias: "a",
                        innerJoin: joins
                    }
                });
                let paginas = Math.ceil(count / limite);
                this.pagina.content = result;
                this.pagina.first = pagina === 0;
                this.pagina.last = paginas === pagina + 1;
                this.pagina.size = limite;
                this.pagina.numberOfElements = count;
                this.pagina.totalPages = paginas;
                return this.pagina;
            }
            catch (err) {
                console.error(err);
                return err.message;
            }
        });
    }
    /**
     *
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    buscar(parametros, transacao, pagina, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let count;
            let paginas;
            if (pagina != undefined && limite != undefined) {
                parametros.skip = pagina;
                parametros.take = limite;
                parametros.relations = parametros.relations;
                console.log('parametros', parametros);
                [result, count] = yield this.repositorio.findAndCount(parametros);
                paginas = Math.ceil(count / limite);
                this.pagina.content = result;
                this.pagina.first = pagina === 1;
                this.pagina.last = paginas === pagina + 1;
                this.pagina.size = limite;
                this.pagina.numberOfElements = count;
                this.pagina.totalPages = paginas;
            }
            else {
                result = typeof transacao !== 'undefined'
                    ? transacao.find(this.repositorio.metadata.target, parametros)
                    : yield this.repositorio.find(parametros);
                paginas = 1;
                this.pagina.content = result;
                this.pagina.first = true;
                this.pagina.last = true;
                this.pagina.size = result.length;
                this.pagina.numberOfElements = result.length;
                this.pagina.totalPages = 1;
            }
            return this.pagina;
        });
    }
    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> parametros utilizados na busca(Object)
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto encontrado
     */
    buscarUm(parametros, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transacao !== 'undefined'
                ? transacao.findOne(this.repositorio.metadata.target, parametros)
                : this.repositorio.findOne(parametros);
        });
    }
    /**
     * Retorna o objeto do ID fornecido
     * @param id ID do objeto a ser encontrado
     * @param paramName <string> nome do parâmetro que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    buscarPorId(id, paramName, transacao, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paramName != undefined && paramName.length > 0)
                return typeof transacao !== 'undefined'
                    ? transacao.findOne(this.repositorio.metadata.target, {
                        where: {
                            relations: relations
                        },
                        [paramName]: id
                    })
                    : this.repositorio.findOne({
                        where: { [paramName]: id },
                        relations: relations
                    });
            else
                return typeof transacao !== 'undefined'
                    ? transacao.findOne(this.repositorio.metadata.target, {
                        where: { id },
                        relations: relations
                    })
                    : this.repositorio.findOne({
                        where: { id },
                        relations: relations
                    });
        });
    }
    /**
     * Retorna a página desejada
     * @param pagina <number>
     * @param limite <number>
     * @returns Promise<Pagina>
     */
    buscarTodos(pagina, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number.isInteger(limite) || !Number.isInteger(pagina)) {
                    return null;
                }
                pagina = pagina <= 0 ? 0 : (pagina - 1) * limite;
                let [result, count] = yield this.repositorio.findAndCount({ skip: pagina, take: limite });
                let paginas = Math.ceil(count / limite);
                this.pagina.content = result;
                this.pagina.first = pagina === 1;
                this.pagina.last = paginas === pagina + 1;
                this.pagina.size = limite;
                this.pagina.numberOfElements = count;
                this.pagina.totalPages = paginas;
                return this.pagina;
            }
            catch (err) {
                console.error(err.message);
                return err.message;
            }
        });
    }
    /**
     *
     * @param id <number> ID do objeto a ser removido
     * @param paramName <string> nome da propriedade que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    remover(id, paramName, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof transacao !== 'undefined') {
                const itemToRemove = (paramName != undefined && paramName.length > 0)
                    ? yield transacao.findOne(this.repositorio.target, { where: { [paramName]: id } })
                    : yield transacao.findOne(this.repositorio.target, { where: { id } });
                return itemToRemove != undefined
                    ? transacao.remove(itemToRemove)
                    : null;
            }
            else {
                const itemToRemove = (paramName != undefined && paramName.length > 0)
                    ? yield this.repositorio.findOne({ where: { [paramName]: id } })
                    : yield this.repositorio.findOne({ where: { id } });
                return itemToRemove != undefined
                    ? this.repositorio.remove(itemToRemove)
                    : null;
            }
        });
    }
    /**
     *
     * @param objeto <T> objeto a ser removido
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    removerObjeto(objeto, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeof transacao !== 'undefined'
                ? transacao.remove(objeto)
                : this.repositorio.remove(objeto);
        });
    }
}
exports.default = Repositorio;
