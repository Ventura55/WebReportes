# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build   # CRA genera /app/build

# ---------- Stage 2: Nginx ----------
FROM nginx:1.27-alpine
COPY --from=build /app/build/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
