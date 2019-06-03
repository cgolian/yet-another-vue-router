const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
      rules: [
          {
              test: /\.ts$/,
              use: 'ts-loader',
              exclude: /node_modules/
          }
      ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'yet-another-vue-router.js',
        library: 'yet-another-vue-router'
    }
};
