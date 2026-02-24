# Subscription Tracker Frontend

Este é o repositório do **Frontend** do ecossistema Subscription Tracker. Ele foi arquitetado com foco em alta performance, segurança e manutenibilidade, empregando padrões avançados do ecossistema React e Next.js para lidar com autenticação complexa, sincronização de estado de servidor e renderização otimizada.

## Stack Tecnológica e Decisões Arquiteturais

A aplicação foi construída vislumbrando um design escalável e modular, separando responsabilidades de infraestrutura, cache e interface.

### 1. Core, Renderização e Proxy de API

- **Next.js 16 (App Router):** Utilizado para orquestrar a renderização híbrida. Tiramos proveito de Server Components (RSC) e SSR para otimizar, delegando a interatividade para Client Components apenas onde necessário.
- **React 19:** Trazendo as últimas otimizações de concorrência e gerenciamento do DOM virtual.
- **TypeScript:** Adoção rigorosa para garantir segurança de tipos de ponta a ponta (Type Safety), facilitando o refatoramento e documentação viva do código.
- **Estratégia de Proxy (BFF Pattern):** A camada de rede foi desenhada para atuar de forma inteligente dependendo do ambiente. No lado do cliente (navegador), as requisições passam pelo Next.js via um proxy (`/api/proxy`), o que previne problemas de CORS e camufla a URL real do nosso backend. Em chamadas de servidor (SSR), o Next.js se comunica diretamente com o microserviço/API.

### 2. Autenticação e Camada de Rede (Axios)

A comunicação HTTP é gerenciada por uma instância centralizada do **Axios** altamente customizada:

- **Injeção Dinâmica de Headers:** Interceptors garantem que o JWT Bearer Token (armazenado com segurança via `js-cookie`) e o cabeçalho de internacionalização (`Accept-Language`) sejam injetados em cada requisição.
- **Refresh Token com Fila Concorrente (Queue System):** Implementamos um mecanismo avançado de interceptação de erros `401 Unauthorized`. Caso múltiplas requisições simultâneas falhem por token expirado, a aplicação entra em estado de `isRefreshing`, enfileira as requisições pendentes na memória (`failedQueue`) e dispara uma única chamada de renovação. Após o sucesso, todas as requisições da fila são reprocessadas de forma transparente para o usuário.

### 3. Gerenciamento de Estado e Sincronização de Dados

Adotamos uma forte separação entre o Estado de Servidor (_Server State_) e o Estado Efêmero de Interface (_Client State_):

- **React Query (@tanstack/react-query v5):** Motor principal de data-fetching, responsável por cache agressivo, dedicação de requisições, paginação e background re-fetching.
- **Padrão Query Key Factory:** Para manter o cache do React Query previsível e evitar colisões, utilizamos fábricas de chaves (ex: `subscriptionKeys.list(params)`). Isso permite invalidações de cache granulares (ex: invalidar apenas a lista de assinaturas sem afetar o cache do _budget_ geral).
- **Zustand:** Gerencia o estado puramente visual e global da UI de forma atômica e performática, sem a necessidade de múltiplos `Providers` de contexto envolvendo a árvore do React.

### 4. Formulários e Validação Estrita

- **React Hook Form:** Controla formulários complexos através de referências (uncontrolled components por baixo dos panos), o que minimiza os re-renders do Virtual DOM, garantindo 60fps na digitação.
- **Zod:** Integrado via `@hookform/resolvers`, o Zod atua como a primeira linha de defesa. Todo _payload_ possui um _Schema_ estático que garante que os dados cheguem à API 100% validados, convertendo erros de forma semântica para os inputs correspondentes.

### 5. Estilização e Ecossistema UI

- **Tailwind CSS v4:** Motor JIT para estilização utilitária. Mantém o bundle CSS microscópico e promove coesão de design tokens.
- **Shadcn UI (Radix Primitives):** Nossa fundação de componentes. O Radix fornece a árvore de acessibilidade (WAI-ARIA, navegação por teclado e foco isolado) de forma _headless_, enquanto acoplamos o Tailwind para a camada visual.
- **Next Themes:** Gerenciamento nativo de Dark/Light mode com suporte a preferências de sistema e eliminação de _hydration mismatch_ (flicker) no carregamento inicial.

## Padronização e Qualidade de Código

A base de código é protegida por ferramentas de linting e padronização para garantir conformidade técnica em PRs:

- **ESLint** para análise estática e prevenção de anti-patterns React.
- **Prettier** (com plugin de ordenação de imports) para formatação consistente.

## Execução e Ambiente Local

O projeto do frontend é preferencialmente servido através do ecossistema central do Docker via projeto raiz. No entanto, para atuar em modo de desenvolvimento isolado (_Standalone_):

1. Instale as dependências (requer Node.js 22+):

```bash
npm install

```

2. Configure o arquivo de variáveis de ambiente (`.env.local`) informando a `NEXT_PUBLIC_API_BASE_URL` se não estiver utilizando a porta padrão (8001).
3. Inicie o servidor de desenvolvimento via Turbo/Next:

```bash
npm run dev

```

A aplicação estará disponível e processando hot-reloads em `http://localhost:3000`.
