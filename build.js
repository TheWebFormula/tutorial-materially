import esbuild from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import build from '@thewebformula/lithe/build';


const plugin = {
  name: 'plugin',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async args => {
      const contextCss = await esbuild.build({
        entryPoints: [args.path],
        bundle: true,
        write: false,
        minify: true,
        loader: { '.css': 'css' }
      });
      const contents = `
        const styles = new CSSStyleSheet();
        styles.replaceSync(\`${contextCss.outputFiles[0].text}\`);
        export default styles;`;
      return { contents };
    })
    build.onEnd(async () => {
      await gzipFile('dist/material.js', 'dist/material.js.gz');
    })
  }
};

const context = await esbuild.context({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: 'dist/material.js',
  format: 'esm',
  target: 'esnext',
  loader: { '.html': 'text' },
  plugins: [plugin],
  minify: true
});


build({
  devWarnings: false,
  spa: true,
  chunks: false,
  basedir: 'docs/',
  outdir: 'dist/',
  onStart() {
    // build tutorial-materially bundle
    context.rebuild();
  }
})
  // .then(() => { // TODO not sure what is going on. The process stop existing on npm run build at some point
  //   esbuild.buildSync({
  //     entryPoints: ['src/styles.css'],
  //     bundle: true,
  //     outfile: 'dist/material.css',
  //     minify: true
  //   });
  //   if (process.env.NODE_ENV === 'production') process.exit();
  // });


const asyncGzip = promisify(gzip);
async function gzipFile(file, rename) {
  const result = await asyncGzip(await readFile(file));
  await writeFile(rename, result);
}
