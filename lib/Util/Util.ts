class Util {

    private async asyncForEachF(array: Array<any>, callback: Function) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    public asyncForEsach(array: Array<any>, callback: Function) {
        async () => {
            await this.asyncForEachF(array, async () => {
                await callback();
            });
        }
    }
}

export default new Util();
