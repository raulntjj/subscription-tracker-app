# Subscription Tracker Frontend

Este é o repositório do **Frontend** do ecossistema Subscription Tracker. Ele foi desenvolvido com foco em alta performance, experiência de usuário fluida e manutenibilidade, utilizando as práticas mais modernas do ecossistema React.

## Stack Tecnológica e Decisões Arquiteturais

A aplicação foi construída vislumbrando um design componentizado e escalável, utilizando as seguintes tecnologias:

### 1. Core e Renderização
* **Next.js 16 (App Router):** Utilizado não apenas como framework React, mas para aproveitar renderização baseada em servidor (SSR/RSC) onde necessário, otimizando o carregamento inicial e SEO interno da plataforma.
* **React 19:** Trazendo as últimas otimizações do DOM virtual e concorrência na renderização da interface.
* **TypeScript:** Adotado rigorosamente para garantir tipagem estática, auto-completar na IDE e prevenir bugs em tempo de desenvolvimento.

### 2. Estilização e UI Components
* **Tailwind CSS v4:** Motor de estilização utilitária. Permite a criação de interfaces responsivas mantendo o tamanho do bundle CSS extremamente reduzido.
* **Shadcn (Radix UI):** Base de nossos componentes acessíveis. O Radix foi escolhido por prover a funcionalidade pura de UI (logica de teclado, focus, e ARIA) sem opinar no estilo, nos permitindo aplicar o Tailwind perfeitamente por cima.
* **Lucide React:** Biblioteca de ícones consistente visualmente e leve.
* **Next Themes:** Gerenciamento nativo e sem *flicker* do Dark Mode/Light Mode.

### 3. Gerenciamento de Estado e Mutação de Dados
A separação entre Estado de Servidor e Estado de Cliente é um pilar da arquitetura:
* **React Query (@tanstack/react-query):** Responsável por todo o *Server State*. Cuida do cache, invalidação, paginação e re-fetch automático dos dados providos pela API.
* **Zustand:** Responsável pelo *Client State* (estado puramente efêmero da UI local). Escolhido por ser minimalista, sem necessidade de *Providers* aninhados no React Tree, e altamente perfomático.
* **Axios:** Cliente HTTP principal, configurado com interceptores para injeção de tokens JWT (Authorization) e tratamento padronizado de respostas de erro da nossa API.

### 4. Formulários e Validação
* **React Hook Form:** Gerencia o estado dos formulários controlando minimamente os re-renders do Virtual DOM, o que mantém alta performance mesmo em formulários extensos.
* **Zod:** *Schema validation* com integração nativa ao Typescript. Garante que qualquer *payload* enviado ou processado passe por uma validação estrita no cliente antes mesmo de atingir a API.

## Padrões de Qualidade

Mantemos a sanidade e padrão da base de código (Clean Code) através de ferramentas automatizadas de linting e formatação executáveis via Node:
* **ESLint**
* **Prettier**

## Requisitos e Inicialização

O projeto do frontend é executado através de Node.js, mas preferencialmente servido através do ecossistema central do Docker via projeto raiz.

Para rodar localmente (ambiente de desenvolvimento isolado sem o Docker central):

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.
