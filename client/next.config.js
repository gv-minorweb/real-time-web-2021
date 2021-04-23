module.exports = {
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    })

    config.module.rules.map((rule) => {
      if (rule.oneOf) {
        rule.oneOf.find((configRule) => {
          if (Array.isArray(configRule.use)) {
            configRule.use.forEach((loaderItem) => {
              const isSassRule = loaderItem.loader && loaderItem.loader.includes('sass-loader')
              if (isSassRule) {
                configRule.use.push({
                  loader: 'sass-resources-loader',
                  options: {
                    resources: [
                      './src/styles/config/_media-queries.scss',
                      './src/styles/config/_fonts.scss'
                    ]
                  },
                })
              }
            })
          }
        })
      }
    })

    return config
  },
}
