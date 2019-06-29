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

    public isCpfValido = (cpf: String): boolean => {
        let soma: number = 0;
        let resto: number;

        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf == '' || cpf.length != 11 || cpf == '00000000000'
            || cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333'
            || cpf == '44444444444' || cpf == '55555555555' || cpf == '66666666666'
            || cpf == '77777777777' || cpf == '88888888888' || cpf == '99999999999')
            return false;

        for (let i: number = 1; i <= 9; i++) {
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11))
            resto = 0;

        if (resto != parseInt(cpf.substring(9, 10)))
            return false;

        soma = 0;

        for (let i: number = 1; i <= 10; i++) {
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11))
            resto = 0;

        if (resto != parseInt(cpf.substring(10, 11)))
            return false;

        return true;
    }

    public icCnpjValido = (cnpj: string): boolean => {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '' || cnpj.length != 14)
            return false;

        if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" ||
            cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" ||
            cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;

        let tamanho: number = cnpj.length - 2;
        let numeros: string = cnpj.substring(0, tamanho);
        let digitos: string = cnpj.substring(tamanho);
        let soma: number = 0;
        let pos: number = tamanho - 7;

        for (let i: number = tamanho; i >= 1; i--) {
            soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;

            if (pos < 2)
                pos = 9;
        }

        let resultado: number = soma % 11 < 2 ? 0 : 11 - soma % 11;

        if (resultado != Number.parseInt(digitos.charAt(0)))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += Number.parseInt(numeros.charAt(tamanho - i)) * pos--;

            if (pos < 2)
                pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Number.parseInt(digitos.charAt(1)))
            return false;

        return true;
    }
}

export default new Util();
