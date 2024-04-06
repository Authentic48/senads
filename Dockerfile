FROM node:18.12.1-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libc6-compat \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["yarn", "run", "start:stage"]
