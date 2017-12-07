import babel from 'rollup-plugin-babel'

export default {
  input: 'index.js',
  output: [
    {format: "cjs", file: "dist/index.cjs.js"},
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ["react"]
    })
  ],
  external: ["react","react-dom/server","lodash"]
}
