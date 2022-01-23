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
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript']
        }
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
  experiments: {
    outputModule: true
  },
  output: {
    path: path.resolve(__dirname, 'packages'),
    library: {
      // https://github.com/webpack/webpack/issues/2933
      // https://webpack.js.org/configuration/output/#type-module
      type: 'module'
    }
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
