import Criptografia from '../Segurança/Criptografia';

class Util {

    /**
     * 
     * @param array Array<any>
     * @param callback <Function>
     */
    private async asyncForEach(array: Array<any>, callback: Function) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    /**
     * Função para utilização de forEach() com async await
     * @param array Array<any> Array a ser percorrido
     * @param funcao <Function> Fução a ser executada em cada item do array
     * @param callback <Function> Função de callback a ser executada após o array ser percorrido
     */
    public async executeasyncForEach(array: Array<any>, funcao: Function, callback?: Function) {
        await this.asyncForEach(array, funcao);

        if (callback)
            callback();
    }

    /**
     * Criptografa as propriedades do objeto que comecem com a palavra "senha"
     * @param objeto <T> objeto em que as propriedades serão criptografadas
     * @returns Promise<T> objeto com as propriedades criptografadas
     */
    public criptografaSenhas = async (objeto: any): Promise<any> => {
        await this.executeasyncForEach(Object.getOwnPropertyNames(objeto), async (propriedade) => {
            if (propriedade.startsWith("senha"))
                objeto[propriedade] = await Criptografia.criptografar(objeto[propriedade]);
        });

        return objeto;
    }
}

export default new Util();
