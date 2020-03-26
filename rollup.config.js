
import babel from "rollup-plugin-babel"
import babelrc from "babelrc-rollup"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import { terser } from "rollup-plugin-terser"

import pkg from "./package.json"

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

export default [{
  input: "src/index.js",
  external,
  output: {
    name: "reactSimpleMaps",      
    file: pkg.browser,
    format: "umd",
    extend: true,
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      "d3-geo": "d3",
      "d3-zoom": "d3",
      "d3-selection": "d3",
      "topojson-client": "topojson",
      "prop-types": "PropTypes",
    },
  },
  plugins: [
    babel(babelrc()),
    resolve(),
    commonjs(),
    terser(),
  ],
}, {
  input: "src/index.js",
  external,
  output: [{
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    },
  ],
  plugins: [
    babel(babelrc()),
  ],
}]
