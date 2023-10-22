const { i18n } = require('./next-i18next.config.js');

module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://maore.io/',
  },
  i18n,
}
