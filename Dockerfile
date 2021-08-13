FROM node:16.5

WORKDIR /app

COPY package.json .
COPY yarn.lock .


RUN yarn

COPY . .

CMD yarn start:dev