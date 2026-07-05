// Generate the CommonJS entry (for the `require` condition) from the ESM source.
import {build} from 'esbuild'
import {mkdirSync} from 'fs'

mkdirSync(new URL('../dist/', import.meta.url), {recursive: true})

await build({
  entryPoints: [new URL('../index.js', import.meta.url).pathname],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  outfile: new URL('../dist/index.cjs', import.meta.url).pathname,
})

console.log('build: dist/index.cjs')
