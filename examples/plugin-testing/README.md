# Rspack Plugin Testing

This workspace contains multiple Rspack projects with different versions of the Zephyr Rspack plugin for testing and compatibility verification.

## Directory Structure

Each directory follows the naming convention `rspack_x.y.z` where `x.y.z` represents the version of the `zephyr-rspack-plugin` being tested.

## Creating a New Test Project

To create a new test project with the latest Rspack version:

```bash
pnpm create rspack@latest -d rspack_x.y.z -t react-ts
```

Replace `x.y.z` with the desired plugin version.

## After Creating a New Project

1. Navigate to the new project directory
2. Install the specific version of the Zephyr Rspack plugin:
   ```bash
   cd rspack_x.y.z
   pnpm add zephyr-rspack-plugin@x.y.z
   ```
3. Update the Rspack configuration to use the plugin

## Running Projects

From the root directory:

- Build all projects:
  ```bash
  pnpm build
  ```

From each project directory:

- Development mode:
  ```bash
  pnpm dev
  ```
- Build:
  ```bash
  pnpm build
  ```
- Preview:
  ```bash
  pnpm preview
  ```

## Supported Versions

Currently testing:
- 0.0.31
- 0.0.32
- 0.0.34
- 0.0.36
- 0.0.38
- 0.0.39