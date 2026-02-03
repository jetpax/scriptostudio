#!/usr/bin/env node
/**
 * Extension Bundler Tool
 * 
 * Bundles extensions from modular source into distributable bundles.
 * 
 * Usage:
 *   node bundle_extensions.js --extensions-dir registry/Extensions [--in-place]
 *   
 * Options:
 *   --extensions-dir   Path to extensions parent directory
 *   --output-dir       Output bundles to this directory (default: in-place)
 *   --in-place         Write bundles directly to each extension's directory
 *   --verbose, -v      Show detailed output
 * 
 * Expects each extension to have:
 *   extension.json  - metadata
 *   src/index.js    - entry point (exports default class)
 *   device/         - optional files for device deployment
 *   styles.css      - optional scoped styles
 */

import * as esbuild from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2)
  const result = {
    extensionsDir: 'registry/Extensions',
    outputDir: null,  // null = in-place mode
    inPlace: true,
    verbose: false
  }
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--extensions-dir' && args[i + 1]) {
      result.extensionsDir = args[++i]
    } else if (args[i] === '--output-dir' && args[i + 1]) {
      result.outputDir = args[++i]
      result.inPlace = false
    } else if (args[i] === '--in-place') {
      result.inPlace = true
      result.outputDir = null
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      result.verbose = true
    }
  }
  
  return result
}

// Check if extension has modular format (has extension.json + src/)
function isModularExtension(extDir) {
  return fs.existsSync(path.join(extDir, 'extension.json')) &&
         fs.existsSync(path.join(extDir, 'src', 'index.js'))
}

// Read and encode device files
function collectDeviceFiles(extDir, meta) {
  const deviceFiles = {}
  const deviceDir = path.join(extDir, 'device')
  
  if (!fs.existsSync(deviceDir)) {
    return deviceFiles
  }
  
  // If devicePaths defined in meta, use that mapping
  if (meta.devicePaths) {
    for (const [srcPath, targetPath] of Object.entries(meta.devicePaths)) {
      const fullPath = path.join(deviceDir, srcPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        deviceFiles[targetPath] = Buffer.from(content).toString('base64')
      }
    }
  } else {
    // Auto-discover: walk device/ directory
    walkDir(deviceDir, (filePath) => {
      const relativePath = path.relative(deviceDir, filePath)
      const content = fs.readFileSync(filePath, 'utf-8')
      // Default target path: /lib/ext/{id}/{relativePath}
      const targetPath = `/lib/ext/${meta.id}/${relativePath}`
      deviceFiles[targetPath] = Buffer.from(content).toString('base64')
    })
  }
  
  return deviceFiles
}

// Recursive directory walker
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      walkDir(filePath, callback)
    } else {
      callback(filePath)
    }
  }
}

// Read optional styles.css
function getStyles(extDir) {
  const stylesPath = path.join(extDir, 'styles.css')
  if (fs.existsSync(stylesPath)) {
    return fs.readFileSync(stylesPath, 'utf-8')
  }
  return null
}

// Bundle a single extension
async function bundleExtension(extDir, outputDir, verbose) {
  const metaPath = path.join(extDir, 'extension.json')
  const entryPath = path.join(extDir, 'src', 'index.js')
  
  // Read metadata
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  const extName = meta.name || path.basename(extDir)
  const extId = meta.id || extName.toLowerCase()
  
  if (verbose) {
    console.log(`  📦 Bundling ${extName} (${extId})...`)
  }
  
  // Bundle JS with esbuild
  const jsResult = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    format: 'esm',
    write: false,
    minify: true,
    target: ['es2020']
  })
  
  const bundledJs = jsResult.outputFiles[0].text
  
  // Collect device files
  const deviceFiles = collectDeviceFiles(extDir, meta)
  
  // Get optional styles
  const styles = getStyles(extDir)
  if (styles) {
    meta.styles = styles
  }
  
  // Generate bundle output
  const bundle = generateBundle(meta, bundledJs, deviceFiles)
  
  // Determine output path (in-place or central)
  const finalOutputDir = outputDir || extDir
  const outputPath = path.join(finalOutputDir, `${extId}.bundle.js`)
  
  // Ensure output dir exists
  if (!fs.existsSync(finalOutputDir)) {
    fs.mkdirSync(finalOutputDir, { recursive: true })
  }
  
  fs.writeFileSync(outputPath, bundle)
  
  const stats = {
    jsSize: bundledJs.length,
    deviceFileCount: Object.keys(deviceFiles).length,
    totalSize: bundle.length
  }
  
  if (verbose) {
    console.log(`    ✓ JS: ${(stats.jsSize / 1024).toFixed(1)}KB, Files: ${stats.deviceFileCount}, Total: ${(stats.totalSize / 1024).toFixed(1)}KB`)
  }
  
  return { id: extId, name: extName, outputPath, stats }
}

// Generate the final bundle format
function generateBundle(meta, jsCode, deviceFiles) {
  const metaJson = JSON.stringify(meta, null, 2)
  const deviceFilesJson = JSON.stringify(deviceFiles, null, 2)
  const buildId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  
  return `// === EXTENSION_BUNDLE ===
// Generated by bundle_extensions.js
// Do not edit - regenerated on each build
// BUILD_ID: ${buildId}

console.log('%c[${meta.name || meta.id}] BUILD ${buildId}', 'color: #ff8c00; font-weight: bold');

export const __EXTENSION_META__ = ${metaJson};

export const __DEVICE_FILES__ = ${deviceFilesJson};

// Bundled extension code
${jsCode}
`
}

// Main
async function main() {
  const args = parseArgs()
  
  console.log('🔧 Extension Bundler')
  console.log(`   Extensions: ${args.extensionsDir}`)
  if (args.inPlace) {
    console.log(`   Output: in-place (each extension directory)`)
  } else {
    console.log(`   Output: ${args.outputDir}`)
  }
  console.log('')
  
  // Ensure output directory exists (if central mode)
  if (args.outputDir && !fs.existsSync(args.outputDir)) {
    fs.mkdirSync(args.outputDir, { recursive: true })
  }
  
  // Find all extension directories
  const extDirs = fs.readdirSync(args.extensionsDir)
    .map(name => path.join(args.extensionsDir, name))
    .filter(dir => fs.statSync(dir).isDirectory())
  
  const results = { bundled: [], legacy: [], failed: [] }
  
  for (const extDir of extDirs) {
    const extName = path.basename(extDir)
    
    if (isModularExtension(extDir)) {
      try {
        const result = await bundleExtension(extDir, args.outputDir, args.verbose)
        results.bundled.push(result)
        console.log(`✅ ${result.name}`)
      } catch (err) {
        console.log(`❌ ${extName}: ${err.message}`)
        results.failed.push({ name: extName, error: err.message })
      }
    } else {
      // Legacy extension - skip
      results.legacy.push({ name: extName })
      if (args.verbose) {
        console.log(`⏭️  ${extName} (legacy format, skipping)`)
      }
    }
  }
  
  // Summary
  console.log('')
  console.log('─'.repeat(40))
  console.log(`Bundled: ${results.bundled.length} extensions`)
  if (results.legacy.length) {
    console.log(`Skipped: ${results.legacy.length} legacy extensions`)
  }
  if (results.failed.length) {
    console.log(`Failed: ${results.failed.length} extensions`)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
