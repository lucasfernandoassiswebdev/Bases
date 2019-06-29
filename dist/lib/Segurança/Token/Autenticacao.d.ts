import { Request, Response } from 'express';
declare class Autenticacao {
    /**
     *
     * @param req <Request> (express)
     * @param res <Response> (express)
     */
    falhaAutenticacao(req: Request, res: Response): void;
    /**
     *
     * @param req <Request> (express)
     * @param res <Response> (express)
     * @param mensagem <string> Mensagem do corpo da resposta
     */
    autenticacaoIrregular(req: Request, res: Response): void;
    /**
     * Gera um JWT de acordo com o conteúdo passado
     * @param conteudoToken <Object> Objeto com os dados a serem criptografados no Token
     * @param chaveCriptografia <string> Chave a ser usada para descriptografar este Token caso necessário
     * @returns Promise<string>
     */
    gerarToken: (conteudoToken: Object, chaveCriptografia: string) => Promise<string>;
    /**
     * Retorna o token gerado no corpo da resposta
     * @param res <Response> (express)
     * @param senha <string> Senha a ser verificada(descriptografada)
     * @param usuario <any> Dados do usuário que está tentando se autenticar no sistema (deve conter as propriedades id e senha)
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @returns <Response> (express)
     */
    sucessoAutenticacao(res: Response, senha: string, usuario: any, chaveCriptografia: string): Promise<void>;
    /**
     * Configura a estratégia de autenticação da API
     * @param servico <any> Classe que extenda Servico<T>, deve conter o método "buscarPorId"
     * @param chaveCriptografia <string> Chave a ser usada para criptografar os dados do Token
     * @returns <Object> Objeto com métodos de inicialização e autenticação da estratégia de validação de Token da API
     */
    configurar(passport: any, servico: any, chaveCriptografia: string): any;
}
declare const _default: Autenticacao;
export default _default;
