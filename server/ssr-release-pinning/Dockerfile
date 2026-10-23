# Runtime image for the SSR server. Build on the host first (`pnpm build:server`):
# the bundle in dist-server/ already contains every dependency, and client assets
# are served by Zephyr, so the image only needs Node and one file.
FROM node:24.22.1-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY dist-server/ ./
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
