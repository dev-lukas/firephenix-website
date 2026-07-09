import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      // The base JS rules can't see type-only usage in TS script blocks
      // (false positives on type imports and DOM lib types). Switching to
      // the typescript-eslint equivalents would fix this properly.
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    // View components are conventionally single-word in this project
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];
