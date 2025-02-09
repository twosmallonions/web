FROM node:22-slim@sha256:83fdfa2a4de32d7f8d79829ea259bd6a4821f8b2d123204ac467fbe3966450fc AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:22-slim@sha256:83fdfa2a4de32d7f8d79829ea259bd6a4821f8b2d123204ac467fbe3966450fc
WORKDIR /app
COPY --from=build /app/build /app/build

LABEL org.opencontainers.image.source="https://github.com/twosmallonions/web"
LABEL org.opencontainers.image.description="TSO web"
LABEL org.opencontainers.image.licenses=MIT

ENTRYPOINT [ "node", "build" ]