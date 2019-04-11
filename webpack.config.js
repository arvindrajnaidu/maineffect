const pkg = require('./package.json')

const path = require('path');
const reScript = /\.(js|jsx|mjs)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './src/maineffect/index.js',
    output: {
      filename: 'maineffect.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'maineffect',
      libraryExport: 'default',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
};