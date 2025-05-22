# Contributing to `sdk`

We're thrilled you're interested in contributing to the `sdk` monorepo! Your efforts help us build a more robust, consistent, and powerful ecosystem for developing websites as microservices. Whether you're fixing a bug, adding a new feature, improving documentation, or suggesting an enhancement, your contributions are highly valued.

## How to Contribute

There are many ways to contribute, and we appreciate them all!

### 1. Reporting Bugs

- **Before reporting:** Please check existing issues to see if the bug has already been reported.

- **Create a new issue:** If not, open a new issue and clearly describe the bug. Provide steps to reproduce it, expected behavior, and actual behavior. Screenshots or code snippets are super helpful!

### 2. Suggesting Enhancements

- **Open an issue:** If you have an idea for a new feature or an improvement to an existing one, open an issue to discuss it.

- **Explain your idea:** Clearly describe the enhancement and why you believe it would be beneficial for the `sdk` ecosystem.

### 3. Improving Documentation

- Good documentation is crucial! If you find areas that can be improved, clarified, or expanded, please consider submitting a pull request. This includes READMEs, API docs, and examples.

### 4. Submitting Code Contributions

- **Fork the repository:** Start by forking the `sdk` repository to your GitHub account.

- **Clone your fork:**

```bash
git clone https://github.com/webnode-ecosystem/sdk.git webnode-sdk
cd webnode-sdk
```

- **Install dependencies:** This project uses pnpm for package management.

```bash
pnpm install
```

- **Create a new branch:** Choose a descriptive branch name.

```bash
git checkout -b feature/your-awesome-feature
# or bugfix/fix-that-nasty-bug
```

- **Make your changes:** Implement your feature, fix the bug, or make your improvements. Ensure your code adheres to the existing coding style and conventions.

- **Run tests:** Before committing, ensure all tests pass. If you're adding new features, please add corresponding tests.

```bash
pnpm test # (or whatever your project's test command is)
```

- **Commit your changes:** We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to maintain a clean and readable commit history. This monorepo also uses `commitlint` to enforce these standards.
  To help you with this, run our `commit` script:

```bash
pnpm commit
```

This will guide you through creating a well-formed commit message.

- **Push your branch:**

```bash
git push origin feature/your-awesome-feature
```

- **Create a Pull Request (PR):**

  - Go to the `sdk` repository on GitHub and open a new pull request from your forked branch to our `main` branch.

  - **Provide a clear title and description** for your PR. Explain what your changes do and why they are necessary.

  - Link to any relevant issues (e.g., `Closes #123`).

  - Be prepared to respond to feedback and make adjustments during the review process.

## Development Guidelines

- **Consistency is key:** Adhere to the existing code style, patterns, and architectural principles already present in the codebase.

- **Testing:** New features should come with tests. Bug fixes should ideally include a test that reproduces the bug before the fix and passes after.

- **Documentation:** Update documentation (code comments, READMEs, etc.) for any new features or significant changes.

## Support

If you have questions or need help, please don't hesitate to open an issue or reach out to the maintainers.

Thank you for your contribution!
