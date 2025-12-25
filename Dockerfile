FROM node:22-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm i -g pnpm 
RUN pnpm i

COPY . .

EXPOSE 8080

CMD ["pnpm", "dev"]