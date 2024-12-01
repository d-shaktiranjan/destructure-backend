FROM node:20.13.1-alpine

RUN mkdir -p /usr/src/destructure && chown -R node:node /usr/src/destructure

WORKDIR /usr/src/destructure

COPY package.json ./

USER node

COPY --chown=node:node . .

RUN [ ! -f .env ] && cp .env.sample .env || echo ".env already exists."


RUN corepack enable pnpm
RUN pnpm i
RUN pnpm build


EXPOSE 8000

CMD [ "pnpm", "start" ]