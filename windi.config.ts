import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['**/*.{tsx,ts}'],
    exclude: ['node_modules', '.next', '.vscode']
  },
});