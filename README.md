# Bases Project
O Bases é uma projeto Nodejs que utiliza Typescript para abstrair uma série de classes e interfaces com a proposta de tornar mais rápido e fácil o desenvolvimento de outros projetos node que utilizem Typescript.

Você pode conferir um projeto funcional que implementa em exemplos as funcionalidades deste pacote neste [link](https://github.com/lucasfernandoassiswebdev/DemoProject)

## Instalação
Para utilizar o projeto basta adicioná-lo como dependência ao seu projeto com o seguinte comando:
```bash
npm install https://github.com/lucasfernandoassiswebdev/Bases --save**
```

## Uso

### Controller

```typescript
import { Controller } from 'bases';
import { Servico, Model } from 'mypackage';

class ExampleController extends Controller<Model> {

    constructor() {
        super(Servico);
    }
}

export default new ExampleController();  
```

A classe Controller exporta alguns métodos default para uso, são eles: **buscar**, **buscarUm**, **buscarPorId**, **buscarTodos**, **salvar**, **salvarLista**, **remover** e **criptografaSenhas**.

Por padrão, os métodos **salvar** e **salvarLista** caso não sobrescritos, irão criptografar todas as propriedades do objeto recebido que comecem com a palavra **"senha"**. 


### Serviço

```typescript
import { Servico } from 'bases';
import { Repositorio, Model } from 'mypackage';

class ServiceExample extends Servico<Model> {
    
    constructor() {
        super(Repositorio);
    }    
}

export default new ServiceExample();  
```

A classe **Servico** exporta os mesmos métodos default que **Controller**, porém, nesta proposta de arquitetura, caso hajam regras de negócio a serem tratadas, os métodos devem ser sobrescritos e implementados aqui.

### Repositório

```typescript
import { Repositorio } from 'bases';
import { Model } from 'mypackage';

class RepositoryExample extends Repositorio<Model> {

    constructor() {
        super(Model);
    }    
}

export default new UsuarioRepositorio();
```

**Repositorio** exporta os mesmos métodos default que **Servico**, a forma como as operações no banco devem ser realizadas está documentada nos métodos da classe.

### Rotas e Autenticação via JWT
A padronização de rotas se dá através da interface **RotasInterface**, os arquivos de rota de cada módulo da API deverão expor as rotas a serem mapeadas na API da seguinte forma:

```typescript
import { Application } from 'express';
import { MyController1, MyController2 } from 'mypackage';
import { RotasInterface } from 'bases';

class ModuleRoutes implements RotasInterface {
   
    public exporRotas = (app: Application, aut: any): void => {
        app.route('/some/route/protected').all(aut.autenticar()).post(MyController1.doSomething);
        app.route('/some/another/route/not/proteceted')..get(MyController2.doSomething);    
    }
        
    public exporControllers(): any[] {
        return [MyController1, MyController2];
    }
}

export default new UsuarioRotas();
```

Após ter todos os módulos mapeando corretamente as rotas necessárias, precisamos criar o arquivo de configuração das rotas:

```typescript
import { Application } from 'express';
import { Rotas, RotasInterface, TokenRotas } from 'bases';

import ServicoAutenticacao from '../app/exemplo/autenticacao';

//importação dos arquivos de rota abaixo
import ArquivoDeRota1 from '../modulo1/rota';
import ArquivoDeRota2 from '../modulo1/rota';
import ArquivoDeRota3 from '../modulo1/rota';
import ArquivoDeRota4 from '../modulo1/rota';

class RotasConfig {
    
    /** 
     * Mapeia a lista de rotas passadas como parâmetro na API
     * @param app <Application> (express)
     * @param aut <any> Classe que irá autenticar as rotas quando necessário     
    */
    public iniciarRotas = (app: Application, aut: any): void => {
        let arquivosDeRota: RotasInterface[] = new Array<RotasInterface>();
        arquivosDeRota.push(new TokenRotas(ServicoAutenticacao, 'chave de criptografia'));
        arquivosDeRota.push(ArquivoDeRota1);
        arquivosDeRota.push(ArquivoDeRota2);
        arquivosDeRota.push(ArquivoDeRota3);
        arquivosDeRota.push(ArquivoDeRota4);

        Rotas.iniciarRotas(app, aut, arquivosDeRota);
    }
}

export default new RotasConfig();
```

O **ServicoAutenticacao** é a classe responsável por verificar se o usuário poderá ou não receber um JWT e utilizá-lo para acessar os recursos da API, deve obrigatoriamente conter o método **buscarPorEmail**.
**TokenRotas** inicia a rota **/token** com o verbo HTTP POST pronta para receber um objeto com os dados do usuário que está tentando se autenticar na API.

Por fim, fazemos a inicialização da rotas na API ao subir o servidor da seguinte forma: 

```typescript
import {  Autenticacao } from 'bases';
import * as passport from 'passport';
import { ServicoAutenticacao } from 'mypackage';

RotasConfig.iniciarRotas(this.app, Autenticacao.configurar(passport, ServicoAutenticacao, 'chave de criptografia'));
```
