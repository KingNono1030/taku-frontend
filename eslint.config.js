import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules'], // 무시할 디렉토리
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'], // 검사할 파일 확장자
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser, // TypeScript 파서
      globals: {
        ...globals.browser, // 브라우저 환경 추가
      },
    },
    plugins: {
      react, // React 플러그인
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off', // React 17+ JSX 자동 변환
      'no-undef': 'off',
    },
  },
];
