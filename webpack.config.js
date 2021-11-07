import path from 'path'
import { fileURLToPath } from 'url'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  mode: 'production',
  entry: {
    'facebook/dist/index': path.resolve(
      __dirname,
      'packages/facebook/src/index.ts'
    ),
    'twitter/dist/index': path.resolve(
      __dirname,
      'packages/twitter/src/index.ts'
    )
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { configFile: 'tsconfig.build.json' }
      },
      {
        // https://webpack.js.org/guides/asset-modules/#inlining-assets
        test: /\.(?:png|svg)$/,
        type: 'asset/inline'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
    plugins: [
      // https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
      new TsconfigPathsPlugin({
        /* options: see below */
      })
    ]
  },
  output: {
    path: path.resolve(__dirname, 'packages')
  }
}
