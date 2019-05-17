declare class Criptografia {
    /**
     * Retorna o conteúdo passado como parâmetro criptografado
     * @param conteudo <string> conteúdo a ser criptografado
     * @returns Promise<string>
     */
    criptografar: (conteudo: string) => Promise<string>;
    /**
     * Verifica a compatibilidade entre senha e hash
     * @param senhaCriptografada <string>
     * @param senha <string>
     */
    hashConfere: (senhaCriptografada: string, senha: string) => Promise<boolean>;
    /**
     * Descriptografa o conteúdo de um JWT
     * @param conteudo <string> Token
     * @param chaveCriptografia <string> Chave utilizada na criptografia do Token
     */
    descriptografarToken: (conteudo: string, chaveCriptografia: string) => Promise<string>;
}
declare const _default: Criptografia;
export default _default;
