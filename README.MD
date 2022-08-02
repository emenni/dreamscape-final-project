
# 💻 Projeto



Projeto de E-commerce desenvolvido pela casa Dreamscape para o Hiring Coders edição 3 da VTEX e Gama Academy.

Dreamscape Store é um e-commerce funcional e responsivo, conta com sistema de sugestões personalidas para que os clientes recebam sugestões dos produtos mais vendidos e que combinam com a compra atual deles.


<h1 align="center">
    <img alt="Capa do Projeto" title="Projeto" src="https://github.com/emenni/dreamscape-final-project/blob/master/FrontEnd/assets/capa.png" />
</h1>




Link da Aplicação: 



## Arquitetura

<h1 align="center">
    <img alt="Arquitetura do Projeto" title="Arquitetura" src="https://github.com/emenni/dreamscape-final-project/blob/master/FrontEnd/assets/arquitetura.png" />
</h1>

# Fluxograma


<h1 align="center">
    <img alt="Fluxograma do Projeto 1" title="Fluxograma1" src="https://github.com/emenni/dreamscape-final-project/blob/master/FrontEnd/assets/fluxograma1.png" />
</h1>


<h1 align="center">
    <img alt="Fluxograma do Projeto 2" title="Fluxograma2" src="https://github.com/emenni/dreamscape-final-project/blob/master/FrontEnd/assets/fluxograma2.png" />
</h1>


## 🛠 Tecnologias Usadas :heart_eyes:

- HTML
- CSS
- Typescript
- Javascript
- REACT
- VTEX
- AWS
- Python
- Shell
- Graphql


### Organização do Projeto

Whimsical: 

https://whimsical.com/desafio-final-1-2-G6KkDw9UqBjTnHHFz9F34R 

https://whimsical.com/desafio-final-2-2-HeXt1t7JF55pRRWapQK78m 


## APIS DA VTEX



## APIS DA AWS

1. Get All Combinations

```
Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion

Método: GET

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}
```

2. Get One Combination

```
combination exemplo: ‘1,2,3,4’

Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion/{{combination}}

Método: GET

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}
```


3. Get One Combination by CombinationId

```
combination exemplo: ‘1,2,3,4’

combinationId exemplo: ‘123e4567-e89b-12d3-a456-426655440000’

Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion/{{combination}}/{{combinationId}}

Método: GET

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}
```

4. Post new combination

```
Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion

Método: POST

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}

Body: 

{

                combination: [“1”,”5”,”9”,”2”], (SkuId dos produtos no pedido formato string)

                orderDate: “YYYY-mm-dd” (formato - “2022-01-20”),

                occurrences: 1, (number) (opcional)

                showInShop: true, (boolean) (opcional)

},

```

5. Post New Skus to combinate

```
Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion/organizer

Método: POST

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}

Body: 

{

“items”: [

      [“1”,”2”], 

      [“1”,”2”,“3”,”6”,“5”],

      [“4”,”3”], 

      [“20”,”30”,“45”,”68”],

      [“189”,”122”,“89”],

      [“7”,”5”]

], (Array com Arrays de SkuId no formato string)

“orderDate”: “YYYY-mm-dd” (formato - “2022-01-20”)

},

```

6. Put update combination by CombinationId

```
combination exemplo: ‘1,2,3,4’

combinationId exemplo: ‘123e4567-e89b-12d3-a456-426655440000’

Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion/{{combination}}/{{combinationId}}

Método: POST

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}

Body: 

{

“occurrences”: 1 (number) (opcional)

“showInShop”: true (boolean) (opcional)

}

```

7. Delete combination by CombinationId

```
combination exemplo: ‘1,2,3,4’

combinationId exemplo: ‘123e4567-e89b-12d3-a456-426655440000’

Rota: https://2zxs9i4im3.execute-api.us-east-1.amazonaws.com/v1/suggestion/{{combination}}/{{combinationId}}

Método: DELETE

headers: {

“Authorization:” “token da sessão vtex (VtexIdclientAutCookie)”,

“Content-Type”: “application/json”

}
```






### Como Utilizar esse Projeto

1. Faça o Clone do Projeto

```
git clone git@github.com:emenni/dreamscape-final-project.git
```

2. Fazer Login na Vtex

```
vtex login AccountName
```

OBS: No Lugar do **AccountName** colocar o nome da sua conta vtex

3. Depois de Logar em seu workspace, rode o Comando vtex setup na pasta react-front e na pasta react

```
vtex setup
```

4.Use o Vtex Link na pasta raiz e na pasta react-front, para conectar seu código a sua loja

```
vtex link
```


# 📝 Licença

Esse projeto foi desenvolvido por:

[Alessia Casado](https://www.linkedin.com/in/alessia-casado/)

[Amanda Almeida](https://www.linkedin.com/in/amanda-almeida-bab4541ab/)

[Arthur Candido](https://www.linkedin.com/in/arthurcandido/)

[Alberto Rebello](https://www.linkedin.com/in/albertorebello/)

[Ciro Carvalho](https://www.linkedin.com/in/cirocj/)

[Michel Negrão](https://www.linkedin.com/in/michelnegrao/)

[Phelipe Lima](https://www.linkedin.com/in/phenogueira/)

[Thiago Feitoza](https://www.linkedin.com/in/tiago-feitoza-oliveira/)

[Victor Evangelista](https://www.linkedin.com/in/victor-cesar-dos-evangelista-a440aa230/)

[Vinicius Lima](https://www.linkedin.com/in/marcos-vinicius-lima/)