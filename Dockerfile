FROM node:20.11.0-alpine as builder
COPY package*.json ./
COPY . .
RUN npm install
ENV NODE_ENV=development
RUN npm run build
CMD npm run start