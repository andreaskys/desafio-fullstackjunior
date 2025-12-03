# Desafio Desenvolvedor Fullstack Júnior G-DASH

## Stacks Utilizadas

* **Coleta:** Python 3.9 + Requests
* **Mensageria:** RabbitMQ
* **Worker:** Go (Golang) 1.25
* **Backend:** NestJS (Node.js) + MongoDB (Mongoose)
* **Frontend:** React + Vite + Tailwind + Shadcn/ui
* **Infra:** Docker & Docker Compose

## Arquitetura

1.  **Python** coleta dados climáticos da Open-Meteo a cada minuto.
2.  Publica os dados na fila `weather_queue` do **RabbitMQ**.
3.  **Worker em Go** consome a fila e faz um POST para a API.
4.  **NestJS** salva no **MongoDB** e serve os dados via REST.
5.  **React** consome a API e exibe Dashboard em tempo real.

## Como Rodar

Pré-requisitos: Docker e Docker Compose instalados.

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/andreaskys/desafio-fullstackjunior](https://github.com/andreaskys/desafio-fullstackjunior)
    cd desafio-fullstack
    ```

2.  Suba os containers:
    ```bash
    docker compose up --build -d
    ```

3.  Acesse a aplicação:
    * **Frontend:** http://localhost:5173
    * **API:** http://localhost:3000/api
    * **RabbitMQ:** http://localhost:15672 (user/password)

## Acesso

O sistema cria um usuário administrador automaticamente na inicialização:

* **Login:** `admin@gmail.com`
* **Senha:** `123456`

## Funcionalidades Extras

* [x] Autenticação JWT completa.
* [x] Integração com API pública (PokéAPI) com paginação.
* [x] Exportação de dados em CSV.
* [x] Insights de IA.

---
Desenvolvido por **Andreas Nunes**