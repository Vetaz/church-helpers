import fs from 'fs'
import path from 'path'
import esbuild from 'esbuild'

const SRC_DIR = 'src/scrapers'
const BUNDLE_OUT_DIR = 'dist/bundle/scrapers'

// Ensure dist/scrapers exists
fs.mkdirSync(BUNDLE_OUT_DIR, { recursive: true })

// Get all .ts files in src/scrapers
const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.ts'))

const builds = files.map((file) => {
  const inPath = path.join(SRC_DIR, file)
  const outPath = path.join(BUNDLE_OUT_DIR, file.replace(/\.ts$/, '.js'))

  return esbuild.build({
    entryPoints: [inPath],
    bundle: true,
    legalComments: 'inline',
    treeShaking: true,
    outfile: outPath,
    platform: 'browser',
    format: 'iife',
    globalName: 'churchHelpers',
    sourcemap: false,
  })
})

Promise.all(builds)
  .then(() => {
    console.log('All scrapers and index built.')
  })
  .catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
