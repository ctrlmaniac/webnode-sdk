# @webnode-ecosystem/definitions

Centralized library for defining Zod schemas and inferring their corresponding TypeScript types across the WebNode ecosystem. This library ensures consistent data structures and robust type safety for all data exchanged within and consumed by WebNode applications and services.

---

## Features

- **Centralized Schema Definitions**: All core data structures are defined using [Zod](https://zod.dev/) for robust validation.
- **Type Inference**: Automatically infers TypeScript types directly from Zod schemas, ensuring strong type safety.
- **Consistent Data Shapes**: Provides a single source of truth for data models, reducing errors and improving maintainability.
- **Enhanced Developer Experience**: Offers auto-completion and compile-time checks for data structures.

---

## Building

Run `nx build @webnode-ecosystem/definitions` to build the library.

---

## Running Unit Tests

Run `nx test @webnode-ecosystem/definitions` to execute the unit tests via [Vitest](https://vitest.dev/).
