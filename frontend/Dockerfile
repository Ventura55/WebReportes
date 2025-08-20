# frontend/Dockerfile (CRA)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# tras COPY package*.json ./
RUN npm install
COPY . .
# añade esta línea ANTES del build:
RUN npm install lucide-react
RUN npm run build

RUN npm install
COPY . .
RUN npm run build   # CRA => genera /build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
