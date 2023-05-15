import type { OutputAsset, OutputChunk } from 'rollup';
import { defineConfig, PluginOption } from 'vite';

const isOutputChunk = (
  chunkOrAsset: OutputChunk | OutputAsset
): chunkOrAsset is OutputChunk => {
  return chunkOrAsset['code'] != null;
};

const wrapIIFE = (): PluginOption => ({
  name: 'wrap-iife',
  generateBundle(options, bundle) {
    const chunks = Object.values(bundle);

    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      if (isOutputChunk(chunk)) {
        // eslint-disable-next-line no-param-reassign
        chunk.code = `(function(){\n${chunk.code}\n})()`;
      }
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wrapIIFE()],
  build: {
    minify: 'esbuild',

    rollupOptions: {
      input: 'src/h5p-editor-copyright.ts',
      output: {
        dir: 'dist',
        inlineDynamicImports: true,
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'main.css';
          }
          return assetInfo.name ?? '';
        },
        entryFileNames: () => {
          return 'bundle.js'; // See comment above
        },
      },
    },

    target: 'es2015',
  },
});
