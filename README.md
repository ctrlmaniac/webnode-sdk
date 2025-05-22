# webnode-sdk

## Welcome to the `webnode-sdk` Monorepo!

This repository serves as the central hub for all **WebNode SDKs, tools, and core libraries**, offering an **opinionated, framework-like approach** to building and deploying **websites as microservices**. Designed for developers who value consistency, scalability, and streamlined development, `webnode-sdk` provides everything you need to create robust and highly composable web applications.

## What is `webnode-sdk`?

`webnode-sdk` is more than just a collection of libraries; it's a **comprehensive ecosystem** built on the principles of:

- **Microservices Architecture:** Develop independent, deployable web services that can be composed to form larger applications. This promotes modularity, team autonomy, and easier scaling.

- **Opinionated Development:** We provide a clear structure and set of best practices to guide your development process, reducing decision fatigue and ensuring consistency across your projects.

- **Framework-like Experience:** While not a traditional monolithic framework, `webnode-sdk` offers cohesive patterns and shared tooling that give you the benefits of a framework – rapid development, common conventions, and integrated solutions – within a microservices context.

- **Unified Monorepo:** By centralizing all related code, we streamline dependency management, facilitate shared utilities, and enable seamless cross-package development.

## Features & Benefits

- **Accelerated Development:** Kickstart your WebNode projects with ready-to-use SDKs and development tools.

- **Enhanced Consistency:** Leverage shared configurations, coding standards, and architectural patterns across all your WebNode microservices.

- **Simplified Management:** Manage all related packages, dependencies, and versions from a single, cohesive repository.

- **Scalability & Resilience:** Build applications composed of independent services that are easier to scale, maintain, and recover from failures.

- **Community-Driven:** Contributions are welcome, helping to evolve and strengthen the WebNode ecosystem for everyone.

## Packages

This monorepo contains various packages, each serving a specific purpose within the WebNode ecosystem. See each package's README for detailed info:

- [@webnode-ecosystem/webnode](sdk/core/README.md): Core runtime and app framework
- [@webnode-ecosystem/types](sdk/types/README.md): Shared TypeScript types and interfaces
- [@webnode-ecosystem/schema](sdk/schema/README.md): Zod schemas and validation logic
- [@webnode-ecosystem/services](sdk/services/README.md): Shared services and utilities
- [@webnode-ecosystem/lifecycle](sdk/lifecycle/README.md): Internal lifecycle utilities
- [@webnode-ecosystem/di](sdk/di/README.md): Internal dependency injection container
- [@webnode-ecosystem/shared](sdk/shared/README.md): Internal helper utilities

## Contributing

We welcome contributions from the community! If you're interested in helping us build the future of WebNode development, please see our [CONTRIBUTING.md](CONTRIBUTING.md) guide for information on how to get started.

## License

This project is licensed under the [MIT License](LICENSE.md).

Ready to revolutionize your web development workflow with a microservices-first approach? Dive into the `webnode-sdk`!
