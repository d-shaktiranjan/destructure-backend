FROM node:current-alpine

# create working directory and set permissions
RUN mkdir -p /usr/src/destructure && chown -R node:node /usr/src/destructure

WORKDIR /usr/src/destructure

# copy only package.json first to install deps
COPY package.json ./

# enable pnpm (as root)
RUN corepack enable pnpm

# switch to non-root user
USER node

# copy rest of the app files
COPY --chown=node:node . .

# ensure .env exists
RUN [ ! -f .env ] && cp .env.sample .env || echo ".env already exists."

# Install dependencies and build
RUN pnpm install
RUN pnpm build

EXPOSE 8000

CMD [ "pnpm", "start" ]