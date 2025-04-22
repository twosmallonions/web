FROM node:22-slim@sha256:1c18d9ab3af4585870b92e4dbc5cac5a0dc77dd13df1a5905cea89fc720eb05b AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@v0.31.0
RUN corepack enable

WORKDIR /app

COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

LABEL org.opencontainers.image.source="https://github.com/twosmallonions/web"
LABEL org.opencontainers.image.description="TSO web"
LABEL org.opencontainers.image.licenses=MIT

RUN useradd -ms /bin/bash runner
USER runner

ENTRYPOINT [ "node", "build" ]