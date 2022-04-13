FROM node:16.13.1-alpine3.14@sha256:8569c8f07454ec42501e5e40a680e49d3f9aabab91a6c149e309bac63a3c8d54 as base

RUN apk add dumb-init
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as dependencies
# install ALL node_modules, including 'devDependencies'
RUN npm install

FROM dependencies as development
COPY . .
EXPOSE 8080
CMD ["dumb-init", "node", "index.js"]