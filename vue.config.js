module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/decision-game-frontend/'
    : '/',

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
}
