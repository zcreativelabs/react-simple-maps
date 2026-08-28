import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import { readFileSync } from "fs"

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"))

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const entries = {
  index: "src/index.ts",
  "core/index": "src/core/index.ts",
  "zoom/index": "src/zoom/index.ts",
}

const sharedPlugins = () => [
  typescript({ tsconfig: "./tsconfig.json" }),
  resolve(),
  commonjs(),
  terser({}),
]

const umdGlobals = {
  react: "React",
  "react-dom": "ReactDOM",
  "d3-geo": "d3",
  "topojson-client": "topojson",
  "d3-zoom": "d3",
  "d3-selection": "d3",
  "d3-color": "d3",
  "d3-interpolate": "d3",
}

const umdNames = {
  index: "ReactSimpleMaps",
  "core/index": "ReactSimpleMapsCore",
  "zoom/index": "ReactSimpleMapsZoom",
}

export default [
  // ESM build: single pass over all entries so rollup can extract
  // code shared between entries (e.g. core, used by both index and
  // zoom) into a common chunk instead of duplicating it.
  {
    input: entries,
    external,
    output: {
      dir: "dist",
      format: "es",
      entryFileNames: "[name].es.js",
      chunkFileNames: "shared/[hash].es.js",
      sourcemap: true,
    },
    plugins: sharedPlugins(),
  },
  // CJS + UMD builds: one self-contained bundle per entry.
  ...Object.entries(entries).map(([name, input]) => ({
    input,
    external,
    output: [
      {
        file: `dist/${name}.cjs.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        name: umdNames[name],
        file: `dist/${name}.umd.js`,
        format: "umd",
        sourcemap: true,
        extend: true,
        globals: umdGlobals,
      },
    ],
    plugins: sharedPlugins(),
  })),
]
