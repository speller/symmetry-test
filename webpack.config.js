const path = require('path')
const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin')

const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'))

module.exports = (env, argv) => {
  const webpackMode = argv.mode || 'development'
  const appTarget = env.APP_TARGET || 'dev'
  console.log(`Webpack mode: ${webpackMode}`)
  console.log(`Application target: ${appTarget}`)

  // Replace env-related modules depending on the APP_TARGET env variable.
  // Should be used only for conditional config files inclusion.
  const configReplacementPlugin = new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function(resource) {
    const r = resource.request.replace(/-APP_TARGET/, `-${appTarget}`)
    console.log(`Replace module '${resource.request}' with '${r}'`)
    resource.request = r
  })

  const entries = {
    'app': './js/client.js',
  }
  const serverEntries = {
    'server': './js/server.js',
    'test': './test/test.js',
  }

  let config = {
    target: 'web',
    // Dev mode web server config
    devServer: {
      inline: true,
      port: 8083,
      host: '0.0.0.0',
      publicPath: '/build',
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, 'web'),
      watchContentBase: true,
      disableHostCheck: true,
    },
    entry: entries,
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // Load styles from JS
            'css-loader', // Ability to import CSS in JS module
            'postcss-loader', // Add CSS prefixes
            'sass-loader?sourceMap', // Compile SCSS to CSS
          ],
        },
        {
          test: /\.css$/,
          use: [
            // 'style-loader',
            // MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
            'url-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: 'file-loader?name=fonts/[name].[ext]',
        },
      ],
    },
    optimization: {
    },
    // Where to put compiled JS
    output: {
      path: path.resolve(__dirname, 'web/build'),
      filename: '[name].js',
    },
    plugins: [
      configReplacementPlugin,
    ],
  }
  if (webpackMode === 'production') {
    // Add JS uglifier and CSS optimization in prod mode
    config.optimization.minimizer = [
      new TerserPlugin(),
    ]
  }



  let serverConfig = {
    target: 'node',
    entry: serverEntries,
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: ['babel-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    // Where to put compiled JS
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
    },
    plugins: [
      configReplacementPlugin,
    ],
    devtool: false,
  }

  // Dev server don't want to reload pages if a node configuration returned
  return isDevServer ? config : [config, serverConfig]
}