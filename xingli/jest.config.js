/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['esbuild-jest', { sourcemap: false }],
  },
  setupFilesAfterEnv: ['./tests/setup.js'],
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
