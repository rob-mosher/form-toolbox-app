# syntax=docker/dockerfile:1

FROM node:18.18.1

WORKDIR /code

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${API_PORT}
