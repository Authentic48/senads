FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production=true

COPY . .

#RUN yarn build

EXPOSE 8080

CMD ["yarn", "run", "start:stage"]
