import path from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prefixPath = 'packages/experiences'
const experiencesPath = path.resolve(__dirname, prefixPath)
const packages = readdirSync(experiencesPath)

export default {
  externalsPresets: {
    node: true // in order to ignore built-in modules like path, fs, etc.
  },

  // https://webpack.js.org/concepts/entry-points/#object-syntax
  entry: Object.fromEntries(
    packages.map(name => [
      // entry chunk name
      `${name}/dist/index`,
      // module that is loaded upon startup
      `${prefixPath}/${name}/src/index.ts`
    ])
  ),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash'],
              presets: ['@babel/preset-env', '@babel/preset-typescript']
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      // https://webpack.js.org/guides/asset-modules/
      {
        test: /\.(?:jpg|png|svg)$/,
        type: 'asset/inline'
      },
      {
        test: /\.(?:sql|vega)$/,
        type: 'asset/source'
      },
      {
        include: path.resolve(__dirname, 'lib', 'data-samples'),
        type: 'asset/resource',
        generator: {
          // do not emit the file to the output bundle
          emit: false,
          // https://webpack.js.org/configuration/module/#rulegeneratorfilename
          // https://webpack.js.org/configuration/output/#template-strings
          filename:
            'https://raw.githubusercontent.com/hestiaAI/hestialabs-experiences/master/packages/lib/data-samples/[name][ext]?contenthash=[contenthash]&filename=[name][ext]'
        }
      }
    ]
  },
  plugins: [new LodashModuleReplacementPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      // https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
      new TsconfigPathsPlugin({})
    ]
  },
  performance: {
    // temporarily disable performance hints
    hints: false
  },
  experiments: {
    topLevelAwait: true,
    outputModule: true
  },
  output: {
    publicPath: '',
    path: experiencesPath,
    library: {
      // https://github.com/webpack/webpack/issues/2933
      // https://webpack.js.org/configuration/output/#type-module
      type: 'module'
    },
    clean: {
      // we want to clean the dist/ directories before each build
      keep: /^[^/]+\/(?:src\/|[^/]+$)/,
      dry: false // set to "true" to do a dry run to see which files are kept
    }
  },
  optimization: {
    // turning off minimization in development mode does not work
    // https://github.com/webpack/webpack/issues/15144
    minimize: true
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
