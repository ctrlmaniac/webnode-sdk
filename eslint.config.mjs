import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            // Private libraries can only depend on other private libraries
            {
              sourceTag: 'access:private',
              onlyDependOnLibsWithTags: ['access:private'],
            },
            // Public libraries can only depend on private and public libraries
            {
              sourceTag: 'access:public',
              onlyDependOnLibsWithTags: ['access:private', 'access:public'],
            },
            // SDK libraries can only depends on other SDK libraries
            {
              sourceTag: 'domain:sdk',
              onlyDependOnLibsWithTags: ['domain:sdk'],
            },
            // Tool libraries can only depend on other tool or utility libraries
            {
              sourceTag: 'domain:tools',
              onlyDependOnLibsWithTags: ['domain:tools', 'type:utility'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
