FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g  @nestjs/cli && npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]