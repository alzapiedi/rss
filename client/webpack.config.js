module.exports = {
  entry: './index.js',
  output: {
    filename: './build/app.js'
  },
  devtool: 'source-map',
  resolve: {
    modules: ['./', 'node_modules']
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
