import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        working: resolve(__dirname, 'working/index.html'),
      },
      output: {
        manualChunks: {
          'globe': ['./src/js/globe.js'],
          'agentation': ['agentation', 'react', 'react-dom'],
          'dialkit': ['dialkit'],
        }
      }
    }
  }
});
