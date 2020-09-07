const path = require('path');

/**
 * Thank you very much @jh3141
 * @see https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
 */
const excludeNodeModulesExcept = function (modules) {
  var pathSep = path.sep;
  if (pathSep == '\\')
    // must be quoted for use in a regexp:
    pathSep = '\\\\';
  var moduleRegExps = modules.map(function (modName) {
    return new RegExp('node_modules' + pathSep + modName);
  });

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (var i = 0; i < moduleRegExps.length; i++)
        if (moduleRegExps[i].test(modulePath)) return false;
      return true;
    }
    return false;
  };
};

// Main configuration
module.exports = () => {

  const context = path.resolve(__dirname, './app');

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      // Don't waste time on Gzipping the cache
      cacheCompression: false,
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      presets: [['@babel/env', { modules: false }]]
    },
  };

  const config = {
    context: context,

    entry: {
      app: path.resolve(context, './index.js')
    },

    resolve: {
      modules: ['app', 'node_modules']
    },

    output: {
      filename: '[name].[contenthash].js',
      path: path.join(__dirname, 'dist'),
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [babelLoader],
          exclude: excludeNodeModulesExcept([
            'debug', // <<<--- THIS IS IT FOLKS!
            // And many other libraries
          ]),
        },
      ],
    },
    target: 'web'
  };

  return config;
};
