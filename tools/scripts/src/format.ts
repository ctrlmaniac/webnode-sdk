#!/usr/bin/env tsx

import { execa } from 'execa';
import { commitIfModified } from './lib/git-utils.ts';

/**
 * @file This script automates the code formatting process for the project.
 * It first checks for files that need formatting using `nx format:check`.
 * If files are found, it then runs `nx format:write` to apply formatting
 * and finally commits any changes if modifications occurred.
 */

/**
 * Main formatting workflow:
 * - Runs format check to get a list of files needing formatting.
 * - If no files need formatting, logs success and exits.
 * - Otherwise, runs the format write command on all files needing formatting.
 * - Commits changes if any files were modified after formatting.
 *
 * @returns {Promise<void>} A promise that resolves when the formatting and commit process is complete.
 * @throws {Error} If any of the underlying `execa` commands fail.
 *
 * @example
 * ```ts
 * import { main } from './format.ts';
 *
 * main().catch(console.error);
 * ```
 */
export async function main(): Promise<void> {
  console.log('🔍 Checking formatting...');
  const { stdout } = await execa('pnpm', ['dlx', 'nx', 'format:check']);

  const filesToFormat = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line && !line.startsWith('>'));

  if (filesToFormat.length === 0) {
    console.log('✅ No files need formatting.');
    return;
  }

  console.log(`🛠️ Formatting files...`);
  await execa('pnpm', ['dlx', 'nx', 'format:write'], { stdio: 'inherit' });

  await commitIfModified('style: code formatted');
}

// This block ensures that the 'main' function is called when the script is executed directly.
if (require.main === module) {
  main().catch((err: unknown) => {
    console.error('❌ Format failed:', err);
    process.exit(1);
  });
}
