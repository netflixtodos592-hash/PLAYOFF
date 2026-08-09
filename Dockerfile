# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Corregido: Instalación limpia forzando la descarga de dependencias opcionales
RUN npm install --include=optional

COPY . .
RUN npm run build

# Etapa 2: Servidor de producción ligero
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
