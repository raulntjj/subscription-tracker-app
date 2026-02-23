# STAGE 1: Base - Configuração comum
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# STAGE 2: Dependencies - Instalação de dependências de produção
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# STAGE 3: Builder - Build da aplicação
FROM base AS builder

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# STAGE 4: Production - Imagem final otimizada
FROM base AS production

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules

COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 3000

USER node

CMD ["npm", "start"]
