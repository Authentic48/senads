FROM node:18.12.1-bullseye-slim as build
ARG STAGE=development
WORKDIR /app
COPY . .
RUN yarn set version stable
RUN yarn install  && \ yarn run build


FROM node:18.12.1-bullseye-slim

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["yarn", "run", "start:stage"]
