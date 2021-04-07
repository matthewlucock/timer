import path from 'path'

import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const SRC = path.resolve(__dirname, 'src')
const DIST = path.resolve(__dirname, 'dist')

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(SRC, 'index.tsx'),
  output: { path: DIST },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: { timer: SRC }
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: '[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: { plugins: [autoprefixer] }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: { includePaths: [SRC] }
            }
          }
        ]
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },

      {
        test: /\.woff2?$/,
        use: {
          loader: 'file-loader',
          options: { name: '[hash:base64:10].[ext]' }
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({ template: path.resolve(SRC, 'static/index.html') })
  ],

  devServer: {
    historyApiFallback: true
  }
}

export default config
