FROM node:lts-alpine3.15 AS builder
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ./src/ ./src/
COPY package.json package-lock.json* tsconfig.json* ./
RUN npm i --include=dev
RUN npm run build

FROM node:lts-alpine3.15
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist/ /usr/src/app/package.json* /usr/src/app/package-lock.json* ./
RUN npm i --include=prod 
CMD ["node", "index.js"]

