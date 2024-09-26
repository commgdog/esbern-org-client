import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  eslint.configs.recommended,
  stylistic.configs.customize({
    semi: true,
  }),
  ...typescriptEslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
];
