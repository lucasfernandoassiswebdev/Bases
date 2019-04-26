import { RepositorioMongo } from './RepositorioMongo';
import { Document } from 'mongoose';

export interface IServicoMongo<T extends Document> {
    buscar(params: any): Promise<T[]>;
    buscarUm(params: any): Promise<T>;
    buscarPoId(id: string): Promise<T>;
    buscarTodos(): Promise<T[]>;
    salvar(params: any): Promise<T>;
    salvarLista(params: any[]): Promise<T[]>;
    atualizar(params: any): Promise<T>;
    atualizarLista(params: any[]): Promise<T[]>;
    remover(params: any): void;
}

export class ServicoMongo<T extends Document> implements IServicoMongo<T> {

    constructor(private repositorio: RepositorioMongo<T>) { }

    /**
     * 
     * @param params <Object> Objeto com os parâmetros da busca a ser realizada
     * @returns Promise<T[]> 
     */
    async buscar(parametros: Object): Promise<T[]> {
        return await this.repositorio.buscar(parametros);
    }

    /**
     * 
     * @param params <Object> Parametros da busca
     * @returns Promise<T> Primeiro objeto encontrado
     */
    async buscarUm(parametros: Object): Promise<T> {
        return await this.repositorio.buscarUm(parametros);
    }

    /**
     * Retorna o objeto do id passado como parâmetro
     * @param id <string> ID do objeto a ser retornado     
     * @returns Promise<T> Objeto encontrado 
     */
    async buscarPoId(id: string): Promise<T> {
        return await this.repositorio.buscarPorId(id);
    }

    /**
     * Retorna todos os documentos do Model
     * @returns Promise<T[]>
     */
    async buscarTodos(): Promise<T[]> {
        return await this.repositorio.buscar({});
    }

    /**
     * Persiste o objeto passado como parâmetro na base
     * @param objeto <T> Objeto a ser salvo
     * @returns Promise<T> Objeto criado
     */
    async salvar(objeto: T): Promise<T> {
        try {
            return await this.repositorio.salvar(objeto);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Persiste os objetos passados como parâmetro na base
     * @param items <T[]> Objetos a serem persistidos
     * @returns Promise<T[]> Objeto criados
     */
    async salvarLista(items: T[]): Promise<T[]> {
        try {
            let createdItems: Array<T>;
            items.forEach(async (item) => {
                createdItems.push(await this.repositorio.salvar(item));
            });

            return createdItems;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Atualiza os dados do objeto passado como parâmetro
     * @param objeto <T> Objeto com os dados atualizados 
     * @returns Promise<T> Objeto atualizado
     */
    async atualizar(objeto: T): Promise<T> {
        return await this.repositorio.atualizar(objeto);
    }

    /**
     * Atualiza os dados dos objetos passado como parâmetro
     * @param items <T[]> Objetos a atualizados a serem salvos
     * @returns Promise<T[]> Objetos atualizados
     */
    async atualizarLista(items: T[]): Promise<T[]> {
        let itensCriados: Array<T>;
        items.forEach(async (item) => {
            itensCriados.push(await this.repositorio.atualizar(item));
        });

        return itensCriados;
    }

    /**
     * Remove o objeto desejado do banco
     * @param id <string> ID do objeto a ser removido
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    remover(id: string): void {
        this.repositorio.remover(id, (erro: any, resultado: any) => {
            if (erro)
                console.error(erro);
        });
    }

    /**
     * Remove os objetos desejados do banco
     * @param ids <string[]> IDs do objetos a serem removidos
     * @param callback <Function> Função coms os parâmetros erro(any) e resultado(any)
     * @returns void
     */
    removerVarios(ids: string[]): void {
        ids.forEach((id) => {
            this.repositorio.remover(id, (erro: any, resultado: any) => {
                if (erro)
                    console.error(erro);
            });
        });
    }
}
