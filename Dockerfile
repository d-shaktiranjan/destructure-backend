FROM node:20.13.1-alpine

RUN mkdir -p /usr/src/destructure && chown -R node:node /usr/src/destructure

WORKDIR /usr/src/destructure

COPY package.json ./

USER node

COPY --chown=node:node . .

RUN npm install
RUN npm run build


EXPOSE 8000

CMD [ "npm", "start" ]