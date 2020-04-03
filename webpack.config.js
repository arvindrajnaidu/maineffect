
const path = require('path');

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
          // use: {
          //   loader: 'babel-loader',
          //   options: {
          //     presets: ['@babel/preset-env']
          //   }
          // }
        }
      ]
    }
};

const clientConfig = {
  ...nodeConfig,
  target: 'web',
  output: {
    ...nodeConfig.output,    
    filename: 'maineffect.web.js',  
  },
  node: {
    fs: 'empty',
  }
}
module.exports = [nodeConfig, clientConfig]
