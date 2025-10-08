import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint2';
import * as path from 'path';

export default defineConfig({
    plugins: [
        react(),
        eslint({
            cache: false,
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['node_modules'],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**'
        ], watch: true,
        coverage: {
            provider: 'v8',
            reporter: [
                'json',
                'html',
                'clover', 
                'lcov',
                'text-summary',
                ['text', { skipFull: true }]
            ],
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
                '**/coverage/**'
            ]
        }
    },
    build: {
        chunkSizeWarningLimit: 1000,
    }
});
