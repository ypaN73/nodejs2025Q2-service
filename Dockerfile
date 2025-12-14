# Обновленный Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl openssl-dev python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

# Установите ВСЕ зависимости (включая devDependencies) для сборки
RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/package*.json ./
# Копируем только production зависимости
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Установите только production зависимости в финальном образе
RUN npm ci --only=production

EXPOSE ${PORT:-4000}

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]