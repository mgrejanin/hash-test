const path = require("path");
const ROOT = path.resolve(__dirname, "src");
const DESTINATION = path.resolve(__dirname, "dist");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: ROOT,

  entry: {
    main: "./main.ts"
  },

  output: {
    filename: "[name].bundle.js",
    path: DESTINATION
  },
  stats: {
    children: false
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [ROOT, "node_modules"]
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: "pre",
        test: /\.js$/,
        use: "source-map-loader"
      },
      {
        enforce: "pre",
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "tslint-loader"
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: "awesome-typescript-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
	},
	plugins: [
    new HtmlWebpackPlugin({
			cache: true,
			title: 'Hash Test',
			template: path.resolve(__dirname, 'src/index.html'),
		})
  ],
  devtool: "cheap-module-source-map",
  devServer: {}
};
