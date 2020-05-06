
const defaultOptions = {
  locale: 'en',
  fallbackLocale: 'en',
  countTag: `{count}`,
  countSeperator: '|',
  messages: {},
  fallbackTranslation: '__NO_TRANSLATION__',

  // ==========
  // Hooks to do your own loggers, push keys to API, ...
  /**
   * Called to get key
   *
   * @param {*} key
   * @param {*} { messages = {}, locale, ns = 'common' }
   * @returns
   */
  getKey (key, { messages = {}, locale, ns = 'common' }) {
    const translation = messages[locale][key]
    return translation
  },

  /**
   * Called if getKey returns false
   *
   * @param {*} key
   * @param {*} { messages, locale, fallbackLocale }
   * @returns
   */
  onMissingKey (key, { messages, locale, fallbackLocale }) {
    console.log(`Missing key for language "${locale}": ${key}`)
    return messages[fallbackLocale][key]
  },

  /**
   * Called after getKey or onMissingKey
   *
   * @param {*} key
   * @param {*} { messages = {}, locale, ns = 'common' }
   */
  parseTranslation (translation, ctx = {}) {
    // Parse variables like {count}, ...
    return translation.replace(/\{(.*?)\}/g, function (match, token) {
      return ctx[token]
    })
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

    // Get hookable methods
    const { getKey } = options

    const $t = function (key, settings = {
      context: '',
      count: 1
    }) {
      const combinedOptions = {
        ...options,
        ...settings
      }

      const translation = getKey(key, combinedOptions) ||
        combinedOptions.onMissingKey(key, combinedOptions) ||
        combinedOptions.fallbackTranslation

      return combinedOptions.parseTranslation(translation, combinedOptions)
    }

    // Special for some compatibility with https://kazupon.github.io/vue-i18n/guide/pluralization.html#accessing-the-number-via-the-pre-defined-argument
    const $tc = function (key, count = 1, settings = {}) {
      const combinedOptions = {
        ...options,
        ...settings,
        count
      }

      const translation = getKey(key, combinedOptions) ||
        combinedOptions.onMissingKey(key, combinedOptions) ||
        combinedOptions.fallbackTranslation

      // Replace count tag e.g. {count}
      const { countTag = '{count}', countSeperator = '|' } = combinedOptions
      const parts = translation.split(countSeperator)

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
      // Cases:
      // 1: odd: '{count} car',
      // 2: car: 'car | cars',
      // 3: apple: 'no apples | one apple | {count} apples'

      // parts index calculator table
      //
      // count   length => 1   2   3
      //
      // -2                0   0   0
      // -1                0   0   0
      // 0                 0   0   0
      // 1                 0   0   1
      // 2                 0   1   2
      // 3                 0   1   2
      // 4                 0   1   2

      // included edge case clamp count == 1 and partslength == 2
      const value = count === 1 && parts.length === 2 ? 0 : count
      const partsIndex = clamp(value, 0, parts.length - 1)

      const part = parts[partsIndex] || options.fallbackTranslation
      return part.replace(countTag, count)
    }

    // Bind to Vue
    Vue.prototype[vueProp] = Vue.observable(options)

    Vue.mixin({
      methods: {
        $t,
        $tc
      }

    })
  }
}
