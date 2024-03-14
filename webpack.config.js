// eslint-disable-next-line @typescript-eslint/no-var-requires
const slsw = require('serverless-webpack')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'esbuild-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': `${__dirname}/source`,
      '@common': `${__dirname}/source/common`,
      '@functions': `${__dirname}/source/functions`,
      '@helpers': `${__dirname}/source/helpers`,
      '@tests': `${__dirname}/tests`
    }
  },
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: `${__dirname}/.webpack`
  }
}
