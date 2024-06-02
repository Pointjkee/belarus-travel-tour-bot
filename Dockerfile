FROM node:20.11.0-alpine as builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD npm run start