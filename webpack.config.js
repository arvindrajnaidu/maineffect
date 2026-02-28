
const path = require('path');
const webpack = require('webpack');

const nodeConfig = {
    mode: 'production',
    target: 'node',
    entry: './src/maineffect/index.js',
    optimization: {
      minimize: false
    },
    output: {
      filename: 'maineffect.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'maineffect',
      libraryExport: 'default',
      libraryTarget: 'umd'
    },
    externals: [/^@babel\/.+$/,],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
        }
      ]
    }
};

const clientConfig = {
  ...nodeConfig,
  target: 'web',
  externals: [],
  output: {
    ...nodeConfig.output,
    filename: 'maineffect.web.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.IS_WEB': JSON.stringify('true'),
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      vm: false,
      path: require.resolve('path-browserify'),
      module: false,
      os: false,
      stream: false,
      buffer: false,
      url: false,
      crypto: false,
      child_process: false,
      worker_threads: false,
      assert: false,
      util: false,
    }
  }
}
module.exports = [nodeConfig, clientConfig]
