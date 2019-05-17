import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';

class Criptografia {

    /**
     * Retorna o conteúdo passado como parâmetro criptografado
     * @param conteudo <string> conteúdo a ser criptografado
     * @returns Promise<string>
     */
    public criptografar = async (conteudo: string): Promise<string> => {
        return await bcrypt.hashSync(conteudo, 10);
    }

    /**
     * Verifica a compatibilidade entre senha e hash
     * @param senhaCriptografada <string>
     * @param senha <string>
     */
    public hashConfere = async (senhaCriptografada: string, senha: string): Promise<boolean> => {
        return await bcrypt.compareSync(senha, senhaCriptografada);
    }

    /**
     * Descriptografa o conteúdo de um JWT
     * @param conteudo <string> Token
     * @param chaveCriptografia <string> Chave utilizada na criptografia do Token
     */
    public descriptografarToken = async (conteudo: string, chaveCriptografia: string): Promise<string> => {
        return await jwt.decode(conteudo, chaveCriptografia);
    }
}

export default new Criptografia();
