module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/decision-game/'
    : '/',

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
}
