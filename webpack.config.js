import path from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packages = readdirSync(path.resolve(__dirname, 'packages'))

export default {
  mode: 'production',
  // https://webpack.js.org/concepts/entry-points/#object-syntax
  entry: Object.fromEntries(
    packages.map(name => [
      // entry chunk name
      `${name}/dist/index`,
      // module that is loaded upon startup
      `packages/${name}/src/index.ts`
    ])
  ),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { configFile: 'tsconfig.build.json' }
      },
      // https://webpack.js.org/guides/asset-modules/
      {
        test: /\.(?:png|svg)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(?:rq|vega|yml)$/,
        type: 'asset/source'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
    plugins: [
      // https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
      new TsconfigPathsPlugin({})
    ]
  },
  output: {
    path: path.resolve(__dirname, 'packages')
  }
}
