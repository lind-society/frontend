# Admin dashboard: Vite build served as static files by nginx.
# VITE_* values are inlined at build time from the .env.production the deploy
# script places in the build context.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
