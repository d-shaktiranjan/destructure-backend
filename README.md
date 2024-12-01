# Setup

## Docker installation

Install [docker](https://docs.docker.com/engine/install/)

To start the services

```bash
docker-compose -f docker-compose.yml up
```

To stop and remove the running service

```bash
docker-compose down
```

## Manual installation

Install [Node](https://nodejs.org/en) or [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)  
If you installed NVM then install Node JS by running following command

```bash
nvm use
```

Enable [pnpm]()

```bash
corepack enable pnpm
```

Now, install the packages

```bash
pnpm i
```

Then create .env file by running following command & add values

```bash
cp .env.sample .env
```

And

```bash
pnpm dev
```

### API docs and figma design.

[https://postman.destructure.in](https://postman.destructure.in)

[https://figma.destructure.in](https://figma.destructure.in)

(We don’t implement this design on our site for specific reasons, but feel free to take a look.)

#### You can also check out the [bun version](https://github.com/d-shaktiranjan/destructure-backend/tree/main-bun).
