FROM node:18.12.1-bullseye-slim
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY . .
RUN yarn build

COPY  /app/package.json ./package.json
COPY  /app/node_modules ./node_modules
COPY  /app/dist ./dist

EXPOSE 8080

CMD ["yarn", "run", "start:stage"]
