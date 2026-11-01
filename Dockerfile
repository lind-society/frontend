# Admin dashboard: Vite build served as static files by nginx.
# VITE_* values are inlined at build time, either from the .env.production the
# deploy script places in the build context or from these build args (the
# local docker-compose passes them; when unset the env file wins).
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.34.9 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_BASE_API_URL
ARG VITE_SECONDARY_API_URL
ARG VITE_GOOGLE_MAP_API_URL
RUN pnpm run build

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
