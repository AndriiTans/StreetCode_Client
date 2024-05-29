const Dotenv = require("dotenv-webpack");
const Webpack = require("webpack");
const { GenerateSW } = require("workbox-webpack-plugin");
const fs = require("fs");

module.exports = {
  entry: {
    main: "./src/index.tsx",
  },
  devtool: "cheap-module-source-map",
  devServer: {
    open: true,
    port: "3000",
    historyApiFallback: true,
    // https: {
      // DEV.NOTE: uncomment and change names of files according to your generated ones

      // key: fs.readFileSync("cert\\localhost+1-key.pem"),
      // cert: fs.readFileSync("cert\\localhost+1.pem"),
    // },
  },
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    symlinks: false,
    alias: require("./webpack.aliases"),
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    publicPath: "/",
  },
  plugins: [
    ...require("./webpack.plugins"),
    new Dotenv({
      path: `./.env`,
    }),
    // new GenerateSW({
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    //   runtimeCaching: [
    //     {
    //       urlPattern: /\.(?:js|css)$/,
    //       handler: 'CacheFirst',
    //       options: {
    //         cacheName: 'static-resources',
    //         expiration: {
    //           maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
    //         },

    //       },
    //     },
    //     {
    //       urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
    //       handler: 'CacheFirst',
    //       options: {
    //         cacheName: 'image-resources',
    //         expiration: {
    //           maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
    //         },
    //       },
    //     },
    //     {
    //       urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
    //       handler:'CacheFirst',
    //       options: {
    //         cacheName: 'font-resources',
    //         expiration: {
    //           maxAgeSeconds: 60 * 60 * 24 * 90, // 3 months
    //         },
    //       },
    //     },
    //     {
    //       urlPattern: /^https?.*/,
    //       handler: 'StaleWhileRevalidate',
    //       options: {
    //         cacheName: 'external-resources',
    //         expiration: {
    //           maxEntries: 260
    //         },
    //       },
    //     },
    //   ],
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name of the package
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // exlude @ symbol from package name (cause it may be used by the server)
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
  performance: {
    hints: false,
  },
};
