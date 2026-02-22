# Dockerfile para Desenvolvimento
FROM node:20-alpine

RUN apk add --no-cache \
    libc6-compat \
    curl \
    bash

WORKDIR /app

COPY --chown=node:node . .

COPY --chown=node:node ops/development/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

USER node

CMD ["/usr/local/bin/entrypoint.sh"]
