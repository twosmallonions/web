import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import neverthrow from 'eslint-plugin-neverthrow'

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs['flat/recommended'],
    prettier,
    ...svelte.configs['flat/prettier'],
    neverthrow.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ['**/*.svelte'],

        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        },

        rules: {
            'svelte/no-target-blank': 'error',
            'svelte/require-each-key': 'error',
            'svelte/no-useless-mustaches': 'error',
            'svelte/valid-each-key': 'error'
        }
    },
    {
        ignores: ['build/', '.svelte-kit/', 'dist/']
    }
);
