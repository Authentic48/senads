FROM node:18.12.1-bullseye-slim as build
ARG STAGE=development
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile --production=true && \
    yarn run build


FROM node:18.12.1-bullseye-slim

WORKDIR /app
COPY --from=build /app/package.json ./package.json
#COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/.env ./.env
COPY --from=build /app/node_modules ./node_modules
#COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist


CMD ["yarn", "run", "start:stage"]
