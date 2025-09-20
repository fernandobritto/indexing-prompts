// eslint-disable-next-line @typescript-eslint/no-var-requires
const slsw = require('serverless-webpack')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: {
      chunks: 'all'
    }
  },
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
      '~': `${__dirname}/src`,
      '@adapters': `${__dirname}/src/adapters`,
      '@domain': `${__dirname}/src/domain`,
      '@ports': `${__dirname}/src/ports`,
      '@tests': `${__dirname}/tests`
    }
  },
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: `${__dirname}/.webpack`
  }
}
