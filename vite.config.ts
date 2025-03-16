import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  server: {
    port: 3000, // 원하는 포트 번호로 변경
    proxy: {
      '/ws': {
        target: 'https://api-duckwho.xyz',
        changeOrigin: true,
        ws: true, // WebSocket 지원 활성화
      },
    },
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
  define: {
    global: 'window', // global 객체를 window로 정의
  },
});
