const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
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
    externals: {
        vue: "vue"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'router.js',
        library: 'vuerouter',
        libraryTarget: "umd"
    }
};
