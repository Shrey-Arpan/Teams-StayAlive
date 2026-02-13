import path from 'path';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          background: path.resolve(__dirname, 'background.ts'),
          contentScript: path.resolve(__dirname, 'contentScript.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'background' || chunkInfo.name === 'contentScript'
              ? '[name].js'
              : 'assets/[name]-[hash].js';
          },
        }
      }
    }
  };
});
