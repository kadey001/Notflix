# MINIMAL DEV
FROM node:14.7.0-alpine as base-step
WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
EXPOSE 3000
EXPOSE 3001

# BUILD
FROM base-step as build-step
COPY . .
RUN yarn build \
    # yarn doesn't have a prune for production cause ??
    && npm prune --production \
    && yarn cache clean \
    && yarn autoclean --force

# PROD
FROM node:14.7.0-alpine as production-step
WORKDIR /usr/app
COPY --from=build-step /usr/app/dist ./dist
COPY --from=build-step /usr/app/.env ./
COPY --from=build-step /usr/app/node_modules ./node_modules
COPY --from=build-step /usr/app/src/lib/video/rat.mp4 ./src/lib/video/rat.mp4
EXPOSE 3000
CMD ["node", "./dist/index.js"]
