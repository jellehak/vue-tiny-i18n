
const defaultOptions = {
  locale: 'en',
  fallbackLocale: 'en',
  countTag: `{count}`,
  countSeperator: '|',
  messages: {},
  fallbackTranslation: '__NO_TRANSLATION__',

  // Add loggers, push keys to API, ...
  onMissingKey (key, { messages, locale, fallbackLocale }) {
    console.log(`Missing key for language "${locale}": ${key}`)
    return messages[fallbackLocale][key]
  },
  getKey (key, { messages = {}, locale }) {
    const translation = messages[locale][key]
    return translation
  }
}

/** Simple i18n plugin */
// https://alligator.io/vuejs/creating-custom-plugins/
export default {
  // The install method will be called with the Vue constructor as
  // the first argument, along with possible options
  install (Vue, _options = defaultOptions, vueProp = '$i18n') {
    // console.log(options);

    // Set config
    const options = {
      ...defaultOptions,

      // Detect language from messages
      languages: Object.keys(_options.messages),
      // Merge in options
      ..._options
    }

    // Bind
    Vue.prototype[vueProp] = Vue.observable(options)

    // Get hookable methods
    const { getKey } = options

    Vue.mixin({
      computed: {
        $t () {
          return function (key) {
            return getKey(key, options) ||
              options.onMissingKey(key, options) ||
              options.fallbackTranslation
          }
        },

        $tc () {
          return function (key, mixed = { count: 1 }) {
            const translation = getKey(key, options) ||
              options.onMissingKey(key, options) ||
              options.fallbackTranslation

            // Settings
            const count = mixed.count ? mixed.count : mixed
            const { countTag, countSeperator } = options

            const parts = translation.split(countSeperator)

            // Replace count tag
            const part = parts[count > 1 ? 1 : 0] || options.fallbackTranslation
            return part.replace(countTag, count)
          }
        }
      }

    })
  }
}
