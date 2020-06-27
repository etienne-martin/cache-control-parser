const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env, argv = {}) => {
  const isDev = argv && argv.mode !== "production";

  return {
    mode: argv.mode || "production",
    entry: {
      index: "./src/index.ts"
    },
    output: {
      globalObject: "this",
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "umd"
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: [/node_modules/],
          enforce: "pre",
          use: [
            {
              loader: "eslint-loader",
              options: {
                emitWarning: true,
                emitError: !isDev
              }
            }
          ]
        },
        {
          test: /\.(js|ts)$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/typescript", ["@babel/preset-env"]],
                plugins: [
                  ["@babel/plugin-proposal-class-properties", { loose: true }],
                  ["@babel/plugin-proposal-optional-chaining"]
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        formatter: "codeframe"
      })
    ]
  };
};
