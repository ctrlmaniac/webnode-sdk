import { simpleGit, type SimpleGit, type StatusResult } from 'simple-git';

const git: SimpleGit = simpleGit();

/**
 * Get a list of modified, created, renamed, and staged files in the current Git repository.
 *
 * @returns {Promise<string[]>} A Promise that resolves to an array of file paths that have been modified.
 *
 * @example
 * ```ts
 * import { getModifiedFiles } from './git-utils.ts';
 *
 * async function showModified() {
 *   const files = await getModifiedFiles();
 *   console.log('Modified files:', files);
 * }
 * showModified();
 * ```
 */
export async function getModifiedFiles(): Promise<string[]> {
  const status: StatusResult = await git.status();

  const modified = [
    ...status.modified,
    ...status.created,
    ...status.renamed.map((r) => r.to),
    ...status.staged,
  ];

  // Remove duplicates
  return [...new Set(modified)];
}

/**
 * Creates a Git commit with the specified message if there are any modified files.
 *
 * - Adds all files (`git add .`)
 * - Commits with the provided message
 * - Skips commit if no files have changed
 *
 * @param {string} message - The commit message to use if there are changes.
 * @returns {Promise<void>} A Promise that resolves when the commit is complete or skipped.
 *
 * @example
 * ```ts
 * import { commitIfModified } from './git-utils.ts';
 *
 * async function commitChanges() {
 *   await commitIfModified('Update modified files');
 * }
 * commitChanges();
 * ```
 */
export async function commitIfModified(message: string): Promise<void> {
  const modified = await getModifiedFiles();

  if (modified.length === 0) {
    console.log('✅ No files modified.');
    return;
  }

  console.log(`📝 Changes detected. Preparing commit...`);
  await git.add('.');
  await git.commit(message);
  console.log(`✅ Commit created: "${message}"`);
}
