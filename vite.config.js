import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
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
