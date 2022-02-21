import { join, resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electronRenderer from 'vite-plugin-electron-renderer';
import pkg from '../../package.json';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  mode: process.env.NODE_ENV,
  plugins: [
    react(),
    // electronRenderer({
    //   resolve: {
    //     'electron-store': 'export default require("electron-store");',
    //     // 'nedb-promises': 'export default require("nedb-promises");',
    //   },
    // }),
  ],
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',
    rollupOptions: {
      // external: ['nedb-promises'],
      // plugins: [nodePolyfills({})],
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      path: 'path-browserify',
      stream: 'stream-browserify',
      http: 'stream-http',
      https: 'https-browserify',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve('packages/renderer/src/variables.less')}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: false,
        }),
        // NodeModulesPolyfillPlugin({}),
      ],
    },
  },
});
