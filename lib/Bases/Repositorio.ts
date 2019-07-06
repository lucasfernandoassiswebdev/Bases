import { Repository, EntityManager, getRepository } from 'typeorm';
import Pagina from '../Pagina';

export interface IRepositorio<T> {
    salvar(entity: any, transaction?: EntityManager): Promise<T>;
    buscar(params: any, transaction?: EntityManager, pagina?: number, limite?: number): Promise<Pagina>;
    buscarUm(params: Object, transaction?: EntityManager): Promise<T>;
    buscarPorId(id: number, paramName?: string, transaction?: EntityManager, relations?: any): Promise<T>;
    buscarTodos(pagina: number, limite: number): Promise<Pagina>;
    remover(id: number, paramName?: string, transaction?: EntityManager): Promise<T>;
    removerObjeto(objeto: T, transacao?: EntityManager): Promise<T>
}

export default abstract class Repositorio<T> implements IRepositorio<T> {

    public repositorio: Repository<T>;
    public pagina: Pagina;

    /**
     * Inicia a classe criando o repositório da classe genérica informada
     * @param classeEntidade <any> classe do Repositório
     */
    constructor(private classeEntidade: any) {
        this.pagina = new Pagina();
    }

    /**
     * Inicia a variável repositório
     */
    public iniciarRepositorio(): void {
        this.repositorio = getRepository(this.classeEntidade);
    }

    /**
     * 
     * @param objeto <T> Objeto a ser salvo
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto criado
     */
    public async salvar(objeto: T, transacao?: EntityManager): Promise<T> {
        return await typeof transacao !== 'undefined'
            ? transacao.save(objeto)
            : this.repositorio.save(objeto);
    }

    /**
     * Retorna uma página com os dados resultantes da busca de acordo com os parâmetros fornecidos
     * @param pagina <number>
     * @param limite <number>
     * @param parametros <any> Objeto com os dados a serem utilizados na busca
     */
    public async filtrar(pagina: number, limite: number, parametros: any): Promise<Pagina> {
        try {
            if (!Number.isInteger(pagina))
                pagina = Math.ceil(pagina);

            if (!Number.isInteger(limite))
                limite = Math.ceil(limite);

            let filtros: string = '';

            //Verifica Todos os parâmetros passados
            let tabelas: Map<string, string> = new Map<string, string>();
            let relation: string[] = [];
            let ordena: any = {};

            for (var propName in parametros) {
                if (parametros.hasOwnProperty(propName)) {
                    if (propName != 'relations' && propName != 'orderBy') {
                        //$ é caractere especial indicando inicio de condição para o campo
                        let field_cond: string[] = propName.split('$');
                        let condicao: string = '=';

                        //posição 0 - campo, 1 - condição
                        let field: string = field_cond[0];
                        let tabela_field: string[] = field.split('.');
                        let letra: number = 97; // 97 = 'a'

                        if (tabela_field.length > 1) {
                            for (var i = 0; i < tabela_field.length - 1; i++) {
                                let busca: string = String.fromCharCode(letra) + '.' + tabela_field[i];

                                if (typeof tabelas.get(busca) === 'undefined') {
                                    letra = 97 + tabelas.size;
                                    tabelas.set(busca, String.fromCharCode(++letra));
                                } else
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
                        let encontrou: boolean = false;

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
                            let erro: string = 'Campo de busca inválido: ' + field + '\n\nCampos válidos (exceto joins):\n';

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
                    } else
                        if (propName == 'relations') {
                            let aux: string[] = parametros[propName].split(',');
                            for (var i = 0; i < aux.length; i++) {
                                relation.push(aux[i]);
                            }
                        } else if (propName == 'orderBy') {
                            let aux: string[] = parametros[propName].split(',');
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
            let joins: any = {};

            for (let key of Array.from(tabelas.keys())) {
                let campo = tabelas.get(key);
                joins[campo] = key;
            }

            let [result, count] = await this.repositorio.findAndCount({
                skip: pagina,
                take: limite,
                where: filtros,
                relations: relation,
                order: ordena,
                join: {
                    alias: "a",
                    innerJoin: joins
                }
            })

            let paginas = Math.ceil(count / limite);
            this.pagina.content = result;
            this.pagina.first = pagina === 0;
            this.pagina.last = paginas === pagina + 1;
            this.pagina.size = limite;
            this.pagina.numberOfElements = count;
            this.pagina.totalPages = paginas;

            return this.pagina;
        } catch (err) {
            console.error(err);
            return err.message;
        }
    }

    /**
     * 
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    public async buscar(parametros: any, transacao?: EntityManager, pagina?: number, limite?: number): Promise<Pagina> {
        let result: any;
        let count: number;
        let paginas: number;

        if (pagina != undefined && limite != undefined) {
            parametros.skip = pagina;
            parametros.take = limite;

            [result, count] = await this.repositorio.findAndCount(parametros);

            paginas = Math.ceil(count / limite);
            this.pagina.content = result;
            this.pagina.first = pagina === 1;
            this.pagina.last = paginas === pagina + 1;
            this.pagina.size = limite;
            this.pagina.numberOfElements = count;
            this.pagina.totalPages = paginas;
        } else {
            result = typeof transacao !== 'undefined'
                ? transacao.find(this.repositorio.metadata.target as any, parametros as any) as Promise<T[]>
                : await this.repositorio.find(parametros);

            paginas = 1;
            this.pagina.content = result;
            this.pagina.first = true;
            this.pagina.last = true;
            this.pagina.size = result.length;
            this.pagina.numberOfElements = result.length;
            this.pagina.totalPages = 1;
        }

        return this.pagina;
    }

    /**
     * Retorna o primeiro objeto encontrado de acordo com os parâmetros fornecidos
     * @param parametros <Object> parametros utilizados na busca(Object)
     * @param transacao <EntityManager>
     * @returns Promise<T> Objeto encontrado
     */
    public async buscarUm(parametros: Object, transacao?: EntityManager): Promise<T> {
        return typeof transacao !== 'undefined'
            ? transacao.findOne(this.repositorio.metadata.target as any, parametros as any) as Promise<T>
            : this.repositorio.findOne(parametros);
    }

    /**
     * Retorna o objeto do ID fornecido
     * @param id ID do objeto a ser encontrado
     * @param paramName <string> nome do parâmetro que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    public async buscarPorId(id: number, paramName?: string, transacao?: EntityManager, relations?: any): Promise<T> {
        if (paramName != undefined && paramName.length > 0)
            return typeof transacao !== 'undefined'
                ? transacao.findOne(this.repositorio.metadata.target as any, {
                    where: {
                        [paramName]: id,
                        relations: relations
                    }
                } as any) as Promise<T>
                : this.repositorio.findOne({ where: { [paramName]: id } });
        else
            return typeof transacao !== 'undefined'
                ? transacao.findOne(this.repositorio.metadata.target as any, { where: { id } } as any) as Promise<T>
                : this.repositorio.findOne({ where: { id } });
    }

    /**
     * Retorna a página desejada
     * @param pagina <number>
     * @param limite <number>
     * @returns Promise<Pagina>
     */
    public async buscarTodos(pagina: number, limite: number): Promise<Pagina> {
        try {
            if (!Number.isInteger(limite) || !Number.isInteger(pagina)) {
                return null;
            }

            pagina = pagina <= 0 ? 0 : (pagina - 1) * limite;

            let [result, count] = await this.repositorio.findAndCount({ skip: pagina, take: limite })

            let paginas = Math.ceil(count / limite);
            this.pagina.content = result;
            this.pagina.first = pagina === 1;
            this.pagina.last = paginas === pagina + 1;
            this.pagina.size = limite;
            this.pagina.numberOfElements = count;
            this.pagina.totalPages = paginas;
            return this.pagina;
        } catch (err) {
            console.error(err.message);
            return err.message;
        }
    }

    /**
     * 
     * @param id <number> ID do objeto a ser removido
     * @param paramName <string> nome da propriedade que identifica o objeto
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    public async remover(id: number, paramName?: string, transacao?: EntityManager): Promise<T> {
        if (typeof transacao !== 'undefined') {
            const itemToRemove: T = (paramName != undefined && paramName.length > 0)
                ? await transacao.findOne(this.repositorio.target as any, { where: { [paramName]: id } } as any) as T
                : await transacao.findOne(this.repositorio.target as any, { where: { id } } as any) as T;

            return itemToRemove != undefined
                ? transacao.remove(itemToRemove)
                : null;
        } else {
            const itemToRemove: T = (paramName != undefined && paramName.length > 0)
                ? await this.repositorio.findOne({ where: { [paramName]: id } })
                : await this.repositorio.findOne({ where: { id } });
            return itemToRemove != undefined
                ? this.repositorio.remove(itemToRemove)
                : null;
        }
    }

    /**
     * 
     * @param objeto <T> objeto a ser removido
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    public async removerObjeto(objeto: T, transacao?: EntityManager): Promise<T> {
        return typeof transacao !== 'undefined'
            ? transacao.remove(objeto)
            : this.repositorio.remove(objeto);
    }
}
