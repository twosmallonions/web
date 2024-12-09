FROM node:22-slim@sha256:a4b757cd491c7f0b57f57951f35f4e85b7e1ad54dbffca4cf9af0725e1650cd8 AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:22-slim@sha256:a4b757cd491c7f0b57f57951f35f4e85b7e1ad54dbffca4cf9af0725e1650cd8
WORKDIR /app
COPY --from=build /app/build /app/build

LABEL org.opencontainers.image.source="https://github.com/twosmallonions/web"
LABEL org.opencontainers.image.description="TSO web"
LABEL org.opencontainers.image.licenses=MIT

ENTRYPOINT [ "node", "build" ]