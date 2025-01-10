import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  server: {
    port: 3000, // 원하는 포트 번호로 변경
  },
  plugins: [
    react(),
    checker({
      typescript: true, // TypeScript만 검사
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
});
