
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
  getKey (key, { messages = {}, locale, ns = 'common' }) {
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
          return function (key, settings = {
            context: '',
            count: 1
          }) {
            const combinedOptions = {
              ...options,
              ...settings
            }
            return getKey(key, combinedOptions) ||
              options.onMissingKey(key, combinedOptions) ||
              options.fallbackTranslation
          }
        },

        $tc () {
          return function (key, settings = { count: 1 }) {
            const combinedOptions = {
              ...options,
              ...settings
            }

            const translation = getKey(key, combinedOptions) ||
              options.onMissingKey(key, combinedOptions) ||
              options.fallbackTranslation

            // Settings
            const count = settings.count ? settings.count : settings
            const { countTag, countSeperator } = combinedOptions

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
