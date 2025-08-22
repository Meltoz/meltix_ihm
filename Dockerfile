# Étape 1 : Build avec Node
FROM node:22-alpine AS builder
WORKDIR /app

# Copier les fichiers de dépendance
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Argument d'environnement public (sera injecté au build Nuxt)
#ARG NUXT_PUBLIC_API_URL
#ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL

# Générer le site statique
RUN npm run generate

# Étape 2 : Image finale avec NGINX
FROM nginx:stable-alpine AS production
WORKDIR /usr/share/nginx/html

# Copier les fichiers générés
COPY --from=builder /app/.output/public ./

# Configuration nginx pour SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]