import { defineConfig } from 'vite';
import { resolve } from 'path';

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
