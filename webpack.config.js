var path = require('path');
var webpack = require('webpack');
var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
var toString  = Function.prototype.call.bind(Object.prototype.toString);
var NODE_ENV  = process.env.NODE_ENV || 'development';
var pkg = require('./package.json');

var OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
var CommonsChunkPlugin   = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DedupePlugin   = webpack.optimize.DedupePlugin;
var DefinePlugin   = webpack.DefinePlugin;

var autoprefixerOptions = {
  browsers: [
    'last 2 versions',
    'iOS >= 7',
    'Android >= 4',
    'Explorer >= 10',
    'ExplorerMobile >= 11'
  ],
  cascade: false
}

module.exports = {
  entry: {
    vendor:   [
      "es6-shim",
      "reflect-metadata",
      "web-animations.min",
      "moment",
      "zone.js",
      "angular2/angular2",
      "angular2/http",
      "angular2/router"
    ],
    app: root('www', 'app', 'app.js')
  },
  output: {
    path: root('www', 'build', 'js'),
    filename: 'app.bundle.js',
    publicPath: 'build/js/'
    //pathinfo: true // show module paths in the bundle, handy for debugging
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "awesome-typescript",
        query: {
          'doTypeCheck': false,
          'useWebpackText': true
        },
        include: [root('www')],
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: "awesome-typescript",
        query: {
          'useWebpackText': true
        },
        include: [root('www')],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "autoprefixer?" + JSON.stringify(autoprefixerOptions), "sass"]
      },
      // Any png-image or woff-font below or equal to 100K will be converted
      // to inline base64 instead
      { test: /\.(png|woff|ttf)(\?.*)?$/, loader: 'url', query: { 'limit': 1000000} }
    ]
  },
  resolve: {
    modulesDirectories: [
      "node_modules",
      "node_modules/ionic-framework/node_modules", // angular is a dependency of ionic
      "node_modules/ionic-framework/dist/js", // for web-animations polyfill
      "node_modules/ionic-framework/dist/src/es5/common" // ionic-framework npm package
    ],
    extensions: ["", ".js", ".ts"]
  },
  // Sass loader configuration to tell webpack where to find the additional SASS files
  // it needs for `ionic`, located in the ionic-framework node module folder.
  // https://github.com/jtangelder/sass-loader#sass-options
  sassLoader: {
    includePaths: [
      rootNode('ionic-framework', 'dist', 'src', 'scss')
    ]
  },

  plugins: [
    new OccurenceOrderPlugin(),
    new DedupePlugin(),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
  ]
};


function getBanner() {
  return 'Angular2 Webpack Starter v'+ pkg.version +' by @gdi2990 from @AngularClass';
}

function root(args) {
  args = sliceArgs(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
  args = sliceArgs(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
