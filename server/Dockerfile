# syntax=docker/dockerfile:1
FROM node:14-alpine

ENV NODE_ENV=production

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json yarn.lock tsconfig.server.json ./

RUN yarn install --frozen-lockfile
RUN yarn build-server

COPY . .

EXPOSE 2568

CMD ["node", "start-server"]
