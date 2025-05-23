#!/usr/bin/env node

import { execa } from 'execa';
import { commitIfModified } from './lib/git-utils.ts';

/**
 * @file This script automates the linting process for the project.
 * It uses `nx` to run lint tasks across multiple projects and
 * commits any modifications if the linting process results in changes.
 */

/**
 * Main function to execute the linting process.
 * @returns {Promise<void>} A promise that resolves when the linting and commit process is complete.
 * @throws {Error} If the linting command fails.
 */
export async function main(): Promise<void> {
  console.log('🚀 Running lint...');
  await execa('pnpm', ['dlx', 'nx', 'run-many', '-t', 'lint'], {
    stdio: 'inherit',
  });

  await commitIfModified('style: code linted');
}

// This block ensures that the 'main' function is called when the script is executed directly.
// It combines checks for tsx (direct/pnpm exec/pnpm dlx) and plain Node.js execution of transpiled JS.
const isMainModule =
  (typeof import.meta.main !== 'undefined' && import.meta.main) || // For tsx (direct, pnpm exec, pnpm dlx)
  import.meta.url === new URL(process.argv[1], import.meta.url).href; // For plain Node.js of transpiled JS

// This block ensures that the 'main' function is called when the script is executed directly.
if (isMainModule) {
  main().catch((err) => {
    console.error('❌ Lint failed:', err);
    process.exit(1);
  });
}
