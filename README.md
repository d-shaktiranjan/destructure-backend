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

Install [Bun](https://bun.sh/) by run the following command.

```bash
curl -fsSL https://bun.sh/install | bash
```

Now, install the packages

```bash
bun install
```

Then create .env file by running following command & add values

```bash
cp .env.sample .env
```

And

```bash
bun dev
```

### API docs and figma design.

[https://postman.destructure.in](https://postman.destructure.in)

[https://figma.destructure.in](https://figma.destructure.in)

(We don’t implement this design on our site for specific reasons, but feel free to take a look.)

**MUST** Follow [Code of conduct](./docs/COC.md).
