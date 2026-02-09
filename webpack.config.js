const path = require("path");

module.exports = (env, argv = {}) => {
  return {
    mode: argv.mode || "production",
    entry: {
      index: "./src/index.ts"
    },
    output: {
      globalObject: "this",
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "umd",
      library: "cacheControl"
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/typescript", ["@babel/preset-env"]]
              }
            }
          ]
        }
      ]
    },
    plugins: []
  };
};
