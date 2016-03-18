module.exports = {
  entry: "./build/tests/index.js",
  output: {
    filename: "out.js",
    path: __dirname + "/dist",
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      }
    ],
  },
}