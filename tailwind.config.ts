import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            flexGrow: {
                2: '2'
            },
            spacing: {
                128: '32rem'
            }
        }
    },

    plugins: [typography, daisyui]
} as Config;
