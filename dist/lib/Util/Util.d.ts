declare class Util {
    /**
     *
     * @param array Array<any>
     * @param callback <Function>
     */
    private asyncForEach;
    /**
     * Função para utilização de forEach() com async await
     * @param array Array<any> Array a ser percorrido
     * @param funcao <Function> Fução a ser executada em cada item do array
     * @param callback <Function> Função de callback a ser executada após o array ser percorrido
     */
    executeasyncForEach(array: Array<any>, funcao: Function, callback?: Function): Promise<void>;
}
declare const _default: Util;
export default _default;
