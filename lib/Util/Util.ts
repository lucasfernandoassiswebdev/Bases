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
}

export default new Util();
