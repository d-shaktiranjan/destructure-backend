FROM oven/bun:1.1.33

RUN mkdir -p /usr/src/destructure && chown -R bun:bun /usr/src/destructure

WORKDIR /usr/src/destructure

COPY package.json bun.lockb ./

USER bun

COPY --chown=bun:bun . .

RUN [ ! -f .env ] && cp .env.sample .env || echo ".env already exists."

RUN bun i

EXPOSE 8000

CMD [ "bun", "start" ]