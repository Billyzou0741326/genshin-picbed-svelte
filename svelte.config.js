import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';
import postcss from './postcss.config.cjs';
import tailwind from './tailwind.config.cjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: postcss,
  }),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: node(),
  },
};

export default config;
