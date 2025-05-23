import { describe, it, expect, vi, beforeEach } from 'vitest';
import { main } from './format.ts'; // Import the function to be tested

const { mockExeca } = vi.hoisted(() => {
  const mockExeca = vi.fn();
  return { mockExeca };
});

const { mockCommitIfModified } = vi.hoisted(() => {
  const mockCommitIfModified = vi.fn();
  return { mockCommitIfModified };
});

// Mock the 'execa' module
vi.mock('execa', () => ({
  execa: mockExeca, // Export the mock function
}));

// Mock the 'commitIfModified' module
vi.mock('./lib/git-utils.ts', () => ({
  commitIfModified: mockCommitIfModified, // Export the mock function
}));

// Mock console.log and console.error to prevent actual logging during tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
const consoleErrorSpy = vi
  .spyOn(console, 'error')
  .mockImplementation(() => undefined);

describe('format.ts', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockExeca.mockClear();
    mockCommitIfModified.mockClear();
    consoleSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  it('should log success and exit if no files need formatting', async () => {
    // Arrange
    mockExeca.mockResolvedValueOnce({ stdout: '' }); // Simulate no files needing format

    // Act
    await main();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('🔍 Checking formatting...');
    expect(mockExeca).toHaveBeenCalledWith('pnpm', [
      'dlx',
      'nx',
      'format:check',
    ]);
    expect(consoleSpy).toHaveBeenCalledWith('✅ No files need formatting.');
    expect(mockExeca).not.toHaveBeenCalledWith(
      'pnpm',
      ['dlx', 'nx', 'format:write'],
      expect.anything()
    ); // Should not call format:write
    expect(mockCommitIfModified).not.toHaveBeenCalled(); // Should not commit
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should format files and commit if files need formatting', async () => {
    // Arrange
    const files = 'src/file1.ts\n> src/file2.ts'; // Simulate files needing format
    mockExeca.mockResolvedValueOnce({ stdout: files }); // First call for format:check
    mockExeca.mockResolvedValueOnce({ exitCode: 0 }); // Second call for format:write

    // Act
    await main();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('🔍 Checking formatting...');
    expect(mockExeca).toHaveBeenCalledWith('pnpm', [
      'dlx',
      'nx',
      'format:check',
    ]);
    expect(consoleSpy).toHaveBeenCalledWith('🛠️ Formatting files...');
    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      ['dlx', 'nx', 'format:write'],
      { stdio: 'inherit' }
    );
    expect(mockCommitIfModified).toHaveBeenCalledWith('style: code formatted');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle format:check command failure', async () => {
    // Arrange
    const error = new Error('format:check failed');
    mockExeca.mockRejectedValueOnce(error); // Simulate failure during format:check

    // Act & Assert
    await expect(main()).rejects.toThrow(error);

    expect(consoleSpy).toHaveBeenCalledWith('🔍 Checking formatting...');
    expect(mockExeca).toHaveBeenCalledWith('pnpm', [
      'dlx',
      'nx',
      'format:check',
    ]);
    expect(mockExeca).not.toHaveBeenCalledWith(
      'pnpm',
      ['dlx', 'nx', 'format:write'],
      expect.anything()
    ); // Should not proceed to write
    expect(mockCommitIfModified).not.toHaveBeenCalled(); // Should not commit
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // Error logging handled by caller
  });

  it('should handle format:write command failure', async () => {
    // Arrange
    const files = 'src/file1.ts';
    mockExeca.mockResolvedValueOnce({ stdout: files }); // format:check succeeds
    const error = new Error('format:write failed');
    mockExeca.mockRejectedValueOnce(error); // Simulate failure during format:write

    // Act & Assert
    await expect(main()).rejects.toThrow(error);

    expect(consoleSpy).toHaveBeenCalledWith('🔍 Checking formatting...');
    expect(mockExeca).toHaveBeenCalledWith('pnpm', [
      'dlx',
      'nx',
      'format:check',
    ]);
    expect(consoleSpy).toHaveBeenCalledWith('🛠️ Formatting files...');
    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      ['dlx', 'nx', 'format:write'],
      { stdio: 'inherit' }
    );
    expect(mockCommitIfModified).not.toHaveBeenCalled(); // Should not commit
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // Error logging handled by caller
  });

  it('should handle commitIfModified failure', async () => {
    // Arrange
    const files = 'src/file1.ts';
    mockExeca.mockResolvedValueOnce({ stdout: files }); // format:check succeeds
    mockExeca.mockResolvedValueOnce({ exitCode: 0 }); // format:write succeeds
    const error = new Error('Commit failed');
    mockCommitIfModified.mockRejectedValueOnce(error); // Simulate commit failure

    // Act & Assert
    await expect(main()).rejects.toThrow(error);

    expect(consoleSpy).toHaveBeenCalledWith('🔍 Checking formatting...');
    expect(mockExeca).toHaveBeenCalledWith('pnpm', [
      'dlx',
      'nx',
      'format:check',
    ]);
    expect(mockExeca).toHaveBeenCalledWith(
      'pnpm',
      ['dlx', 'nx', 'format:write'],
      { stdio: 'inherit' }
    );
    expect(mockCommitIfModified).toHaveBeenCalledWith('style: code formatted');
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // Error logging handled by caller
  });
});
