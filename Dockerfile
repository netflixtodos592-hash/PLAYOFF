# Etapa de compilación
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
# Forzar la descarga del binario correcto de Tailwind para el sistema actual
RUN npm rebuild @tailwindcss/oxide --build-from-source || true
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
