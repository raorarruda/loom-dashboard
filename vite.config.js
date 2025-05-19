import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default {
    root: './',
    server: {
      port: 3000,
      watch: {
        ignored: ['!**/tailwind.config.js'],
      }
    }
  }
  