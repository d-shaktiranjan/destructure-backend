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

Now, install the packages

```bash
npm install
```

Then create .env file by running following command & add values

```bash
cp .env.sample .env
```

And

```bash
npm run dev
```

**MUST** Follow [Code of conduct](./docs/COC.md).

### API docs and figma design.

[https://postman.destructure.in](https://postman.destructure.in)

[https://figma.destructure.in](https://figma.destructure.in)

(We don’t implement this design on our site for specific reasons, but feel free to take a look.)
