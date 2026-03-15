import fs from 'fs'
import path from 'path'
import esbuild from 'esbuild'

const SRC_DIR = 'src/scrapers'
const OUT_DIR = 'dist/scrapers'

// Ensure dist/scrapers exists
fs.mkdirSync(OUT_DIR, { recursive: true })

// Get all .ts files in src/scrapers
const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.ts'))

const builds = files.map((file) => {
  const inPath = path.join(SRC_DIR, file)
  const outPath = path.join(OUT_DIR, file.replace(/\.ts$/, '.js'))

  return esbuild.build({
    entryPoints: [inPath],
    bundle: true,
    legalComments: 'inline',
    treeShaking: true,
    outfile: outPath,
    platform: 'browser',
    format: 'esm',
    sourcemap: false,
  })
})

Promise.all(builds)
  .then(() => console.log('All scrapers built.'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
