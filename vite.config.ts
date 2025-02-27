import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://oauth2-proxy:4180',
            },
            '/oauth2': {
                target: 'http://oauth2-proxy:4180'
            }
        }
    }
});
