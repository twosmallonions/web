FROM node:22-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:22-slim
WORKDIR /app
COPY --from=build /app/build /app/build

ENTRYPOINT [ "node", "build" ]