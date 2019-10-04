const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const helpers = require("./webpack/helpers");
const webpackConfig = require("./webpack/config");

module.exports = (env, options) => {
  const isProduction = options.mode === "production";

  if (isProduction) {
    webpackConfig.optimization.minimizer.push(
      new TerserJSPlugin({
        include: /\.min\./,
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.min\.css$/g,
      }),
    );
  } else {
    webpackConfig.devtool = "#eval-source-map";
  }

  const entryFilesOutputPathMappings = helpers.getSourceOutputMappings(isProduction);
  return Object.entries(entryFilesOutputPathMappings).map(mappings => {

    const entry = {
      main: mappings[0],
    };

    if (isProduction) {
      entry["main.min"] = entry.main;
    }

    return {
      entry,
      output: {
        path: mappings[1],
        filename: '[name].js'
      },
      ...webpackConfig,
    }
  });
}
