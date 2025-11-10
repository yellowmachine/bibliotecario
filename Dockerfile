# Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app

# Habilitar Corepack y pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Recibir variables en build time
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL

# Exportarlas como variables de entorno para pnpm run build
ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build (ahora tiene acceso a las variables)
RUN pnpm run build

# Prune devDependencies
RUN pnpm prune --production

# Etapa final
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

CMD ["node", "build/index.js"]