// .eslintrc.js
module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'prettier', // Must be last to override other formatting rules
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Allow console during dev
    eqeqeq: ['error', 'always'], // Add other specific ESLint rules as desired, but let Prettier handle formatting.
  },
  plugins: ['jest'],
};
