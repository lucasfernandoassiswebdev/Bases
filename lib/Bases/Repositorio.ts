import { Repository, EntityManager, getConnection } from 'typeorm';
import Pagina from '../Pagina';

export interface IRepositorio<T> {
    salvar(entity: any, transaction?: EntityManager): Promise<T>;
    buscar(params: Object, transaction?: EntityManager): Promise<T[]>;
    buscarUm(params: Object, transaction?: EntityManager): Promise<T>;
    buscarPorId(id: number, transaction?: EntityManager): Promise<T>;
    buscarTodos(pagina: number, limite: number): Promise<Pagina>;
    remover(id: number, transaction?: EntityManager): Promise<T>;
}

export abstract class Repositorio<T> implements IRepositorio<T> {

    public repositorio: Repository<T>;
    public pagina: Pagina;

    /**
     * Inicia a classe criando o repositório da classe genérica informada
     * @param classeEntidade TypeORM Model
     * @param conexao Conexão gerada pelo typeorm a partir do "createConnection"
     */
    constructor(classeEntidade: any) {
        this.repositorio = getConnection().getRepository(classeEntidade);
        this.pagina = new Pagina();
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
     * 
     * @param parametros <Object> Objeto com os dados a serem utilizados como parâmetro na busca
     * @param transacao <EntityManager>
     * @returns Promise<T[]> Objetos encontrados
     */
    public async buscar(parametros: Object, transacao?: EntityManager): Promise<T[]> {
        return typeof transacao !== 'undefined'
            ? transacao.find(this.repositorio.metadata.target as any, parametros as any) as Promise<T[]>
            : this.repositorio.find(parametros);
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
     * @param transacao <EntityManager>
     * @returns Promise<T>
     */
    public async buscarPorId(id: number, transacao?: EntityManager): Promise<T> {
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
            this.pagina.first = pagina === 0;
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
     * @param transacao <EntityManager>
     * @returns Promise<T> Retorna o objeto removido
     */
    public async remover(id: number, transacao?: EntityManager): Promise<T> {
        if (typeof transacao !== 'undefined') {
            const itemToRemove: T = await transacao.findOne(this.repositorio.target as any, { where: { id } } as any) as T;
            return transacao.remove(itemToRemove);
        } else {
            const itemToRemove: T = await this.repositorio.findOne({ where: { id } });
            return this.repositorio.remove(itemToRemove);
        }
    }
}
