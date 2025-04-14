# 🛒 Ecommerce Backend – NestJS + Prisma

Este é o backend da aplicação **Ecommerce** desenvolvida como parte do **desafio técnico da WavingTest**. A API foi construída com **NestJS** e utiliza **Prisma ORM** para persistência de dados, além de autenticação com JWT e integração com **Cloudinary** para upload de imagens dos produtos.

---

## 🚀 Deploy em Produção

> Você pode acessar a API em produção pelo link:

🔗 **https://ecommerce-rx-vinicius.koyeb.app**

---

## 📦 Funcionalidades Implementadas

### 👤 Área do Cliente

- Cadastro de usuário
- Login com JWT
- Listagem de produtos
- Detalhes de produto
- Carrinho (gerenciado no frontend)
- Finalização de pedidos

### 🔐 Área Administrativa

- Login como ADMIN
- CRUD completo de produtos (com upload de imagens para o Cloudinary)
- Listagem de todos os pedidos realizados

---

## 🔧 Tecnologias Utilizadas

- **NestJS** – Estrutura do backend
- **Prisma ORM** – Acesso tipado ao banco de dados PostgreSQL
- **JWT** – Autenticação segura
- **Cloudinary** – Upload de imagens
- **Swagger** – Documentação da API

---

## ⚙️ Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/rxvinicius/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Renomeie o arquivo `.env.example` para `.env`:

```bash
mv .env.example .env
```

Depois disso, preencha os valores adequados para as variáveis abaixo:

> ℹ️ Para instruções sobre a `DATABASE_URL`, veja a próxima seção [Configure o banco de dados](#4-configure-o-banco-de-dados).

```env
PORT=3001
DATABASE_URL=<sua conexão aqui>
JWT_SECRET=<sua chave secreta>
CLOUDINARY_CLOUD_NAME=<sua cloud>
CLOUDINARY_API_KEY=<sua chave>
CLOUDINARY_API_SECRET=<sua secret>
```

### 4. Configure o banco de dados

Exemplo de conexão local:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public
```

> ℹ️ A URL acima usa o usuário `postgres` com senha `postgres`.  
> Ajuste a URL no seu `.env` conforme necessário.

Para criar o banco, execute:

```bash
npx prisma migrate dev
```

### 5. Rode o projeto

```bash
npm run start:dev
```

A API estará rodando em: http://localhost:3001

## 📁 Estrutura do Projeto

```bash
src/
├── auth/                # Módulo de autenticação
├── products/            # CRUD de produtos
├── orders/              # Finalização e visualização de pedidos
├── access-control/      # Controle de acesso por papéis
├── shared/              # Tipos e middlewares compartilhados
└── prisma/              # Configuração do ORM

```

## 📌 Observações

- O backend foi deployado via Dockerfile na [Koyeb](https://www.koyeb.com).
- Todas as entidades possuem validação com class-validator.
- A API está documentada via Swagger.
- Testes automatizados podem ser adicionados posteriormente para garantir ainda mais qualidade.
- O projeto está pronto para expansão com novas funcionalidades e escalabilidade.

## 🧠 Decisões Técnicas & Observações Finais

- ✅ A aplicação foi construída com foco em **boas práticas**, como separação de responsabilidades, consistência nos DTOs, validações robustas e tipagem forte com TypeScript.
- ❌ Por conta do tempo limitado, **não foi possível implementar testes automatizados (unitários ou e2e)**. No entanto, o projeto está preparado para isso, com Jest já configurado e exemplos de scripts prontos no `package.json`.
- 🚧 Alguns recursos extras como filtros de produtos e dashboard administrativo foram considerados, mas priorizei entregar o core funcional com qualidade e boa experiência de uso.

## 🙋‍♂️ Desenvolvido por

Vinicius Rodrigues Xavier

## 💬 Contato

Fique à vontade para entrar em contato:

- ✉️ vinicius-rodrigues2000@hotmail.com
- 📞 (14) 99848-1539
