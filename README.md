# API Gateway

The API Gateway is the entry point for the Ecommerce Microservices system.

It exposes REST APIs to clients and communicates with internal microservices using gRPC.

## Architecture

```text
Client
  |
  | HTTP / REST
  v
API Gateway
  |
  |----------------------|
  |                      |
  | gRPC                 | gRPC
  v                      v
User Service       Catalog Service
```

## Responsibilities

* Expose REST APIs to clients
* Handle HTTP-specific concerns
* Validate incoming requests
* Communicate with microservices through gRPC
* Transform REST requests into gRPC requests
* Transform gRPC responses into REST responses
* Handle HTTP exceptions and errors

## Tech Stack

* Node.js
* NestJS
* TypeScript
* REST
* gRPC
* Protocol Buffers

## Related Services

* [User Service](https://github.com/BoolMind/user-service)
* [Catalog Service](https://github.com/BoolMind/catalog-service)
* [Common](https://github.com/BoolMind/ecommerce-common)
* [Ecommerce Contracts](https://github.com/BoolMind/ecommerce-contracts)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
NODE_ENV=development
SERVICE_NAME=api-gateway
PORT=3000

USER_GRPC_HOST=localhost
USER_GRPC_PORT=50051

CATALOG_GRPC_HOST=localhost
CATALOG_GRPC_PORT=50052
```

Do not commit the `.env` file.

## Running the Application

Development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm run start:prod
```

## License

Private project developed under BoolMind.
