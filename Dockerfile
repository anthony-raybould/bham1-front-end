FROM node:18

WORKDIR /home/node/app

COPY package*.json ./

ARG API_URL

ENV API_URL ${API_URL}

ENV UI_PORT 8080

RUN npm ci

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]