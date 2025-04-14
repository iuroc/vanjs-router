import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/router.ts',
            name: 'router',
            fileName: 'vanjs-router',
            formats: ['iife']
        },
        rollupOptions: {
        }
    },
})