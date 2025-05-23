import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getModifiedFiles, commitIfModified } from './git-utils.ts';
// Import necessary types from 'simple-git'
import type {
  StatusResult,
  SimpleGit,
  TaskOptions,
  SimpleGitTaskCallback,
  CommitResult,
  Options,
} from 'simple-git';

// Use vi.hoisted to define the mockGit instance and its internal mocks
const { mockGit, mockStatusResult, mockStatus, mockAdd, mockCommit } =
  vi.hoisted(() => {
    // Correctly type vi.fn() by passing the entire function signature
    // as the single type argument.

    // Type for SimpleGit's status method
    type StatusMethod = (
      options?: TaskOptions | undefined,
      callback?: SimpleGitTaskCallback<StatusResult> | undefined
    ) => Promise<StatusResult>;
    const mockStatus = vi.fn<StatusMethod>(); // Correct: single function signature type argument

    // Type for SimpleGit's add method
    type AddMethod = (
      files: string | string[],
      callback?: SimpleGitTaskCallback<string> | undefined
    ) => Promise<string>;
    const mockAdd = vi.fn<AddMethod>(); // Correct

    // Type for SimpleGit's commit method
    type CommitMethod = (
      message: string | string[],
      files?: string | string[] | undefined,
      options?: Options | undefined, // Use Options if applicable, or TaskOptions
      callback?: SimpleGitTaskCallback<CommitResult> | undefined
    ) => Promise<CommitResult>;
    const mockCommit = vi.fn<CommitMethod>(); // Correct

    const initialMockStatusResult: StatusResult = {
      not_added: [],
      conflicted: [],
      created: [],
      deleted: [],
      ignored: [],
      modified: [],
      renamed: [],
      staged: [],
      files: [],
      isClean: () => true, // Default to clean
      ahead: 0,
      behind: 0,
      current: null,
      tracking: null,
      detached: false,
    };

    // Define the mockGitInstance using the correctly typed mocks
    // Cast to 'unknown' first, then to 'SimpleGit' to satisfy TypeScript
    // when not all methods of SimpleGit are mocked.
    const mockGitInstance: SimpleGit = {
      status: mockStatus,
      add: mockAdd,
      commit: mockCommit,
      // If your `git-utils.ts` uses other methods (e.g., `pull`, `push`),
      // you'd need to add `mockPull: vi.fn(),` here and define `mockPull` above.
    } as unknown as SimpleGit; // Cast via unknown

    return {
      mockGit: mockGitInstance,
      mockStatusResult: initialMockStatusResult,
      mockStatus,
      mockAdd,
      mockCommit,
    };
  });

// Now, vi.mock refers to the hoisted mockGit
vi.mock('simple-git', async () => {
  const actual = await vi.importActual<typeof import('simple-git')>(
    'simple-git'
  );
  return {
    ...actual,
    simpleGit: () => mockGit, // `mockGit` is guaranteed to be initialized here
  };
});

// Mock console.log to prevent actual logging during tests
const consoleLogSpy = vi
  .spyOn(console, 'log')
  .mockImplementation(() => undefined);

// Ensure mocks are reset before each test
beforeEach(() => {
  mockStatus.mockClear();
  mockAdd.mockClear();
  mockCommit.mockClear();

  // Set default mock behavior for status
  mockStatus.mockResolvedValue({ ...mockStatusResult, isClean: () => true });

  consoleLogSpy.mockClear();
});

describe('getModifiedFiles', () => {
  it('returns an empty array if no files are modified', async () => {
    // mockStatus is already mocked to be clean by beforeEach
    const result = await getModifiedFiles();
    expect(result).toEqual([]);
  });

  it('returns modified, created, renamed, and staged files without duplicates', async () => {
    const status: StatusResult = {
      ...mockStatusResult, // Use the base mockStatusResult
      isClean: () => false, // Indicate not clean
      modified: ['file1.ts'],
      created: ['file2.ts'],
      renamed: [{ from: 'file3_old.ts', to: 'file3.ts' }],
      staged: ['file1.ts', 'file4.ts'],
    };

    mockStatus.mockResolvedValue(status);

    const result = await getModifiedFiles();
    expect(result.sort()).toEqual(
      ['file1.ts', 'file2.ts', 'file3.ts', 'file4.ts'].sort()
    );
  });
});

describe('commitIfModified', () => {
  it('logs and does nothing if no files are modified', async () => {
    // mockStatus is already mocked to be clean by beforeEach
    await commitIfModified('test commit');
    expect(consoleLogSpy).toHaveBeenCalledWith('✅ No files modified.');
    expect(mockGit.add).not.toHaveBeenCalled();
    expect(mockGit.commit).not.toHaveBeenCalled();
  });

  it('adds, commits, and logs if files are modified', async () => {
    const status: StatusResult = {
      ...mockStatusResult,
      isClean: () => false, // Indicate not clean
      modified: ['file1.ts'],
    };

    mockStatus.mockResolvedValue(status);
    mockAdd.mockResolvedValueOnce('add success'); // Ensure `add` resolves to a string
    mockCommit.mockResolvedValueOnce({
      hash: 'mockhash', // Top-level property
      author: { name: 'Test User', email: 'test@example.com' }, // Required
      branch: 'main', // Required
      commit: 'mockcommitmessage', // This is usually the commit message or short hash, also required
      root: true,
      summary: {
        changes: 1,
        insertions: 1,
        deletions: 0,
        date: '2025-01-01T00:00:00Z', // Example date
        author: 'Test User',
        comments: 'mock commit summary',
        body: '',
      },
      // If there are other required properties of CommitResult, add them here
    } as CommitResult); // Cast to CommitResult

    await commitIfModified('update file1');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `📝 Changes detected. Preparing commit...`
    );
    expect(mockGit.add).toHaveBeenCalledWith('.');
    expect(mockGit.commit).toHaveBeenCalledWith('update file1');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '✅ Commit created: "update file1"'
    );
  });

  it('should throw an error if git status fails', async () => {
    const error = new Error('Git status failed');
    mockStatus.mockRejectedValueOnce(error);

    await expect(commitIfModified('test commit')).rejects.toThrow(error);
    expect(mockGit.status).toHaveBeenCalledTimes(1);
    expect(mockGit.add).not.toHaveBeenCalled();
    expect(mockGit.commit).not.toHaveBeenCalled();
  });

  it('should throw an error if git add fails', async () => {
    mockStatus.mockResolvedValueOnce({
      ...mockStatusResult,
      isClean: () => false,
      modified: ['file1.ts'],
    });
    const error = new Error('Git add failed');
    mockAdd.mockRejectedValueOnce(error);

    await expect(commitIfModified('test commit')).rejects.toThrow(error);
    expect(mockGit.status).toHaveBeenCalledTimes(1);
    expect(mockGit.add).toHaveBeenCalledWith('.');
    expect(mockGit.commit).not.toHaveBeenCalled();
  });

  it('should throw an error if git commit fails', async () => {
    mockStatus.mockResolvedValueOnce({
      ...mockStatusResult,
      isClean: () => false,
      modified: ['file1.ts'],
    });
    // FIX IS HERE: Change undefined to a string
    mockAdd.mockResolvedValueOnce('add success'); // Resolved the undefined issue

    const error = new Error('Git commit failed');
    mockCommit.mockRejectedValueOnce(error);

    await expect(commitIfModified('test commit')).rejects.toThrow(error);
    expect(mockGit.status).toHaveBeenCalledTimes(1);
    expect(mockGit.add).toHaveBeenCalledWith('.');
    expect(mockGit.commit).toHaveBeenCalledWith('test commit');
  });
});
