
const defaultOptions = {
  locale: 'en',
  fallbackLocale: 'en',
  countTag: `{count}`,
  countSeperator: '|',
  messages: {}
}

/** Simple i18n plugin */
// https://alligator.io/vuejs/creating-custom-plugins/
export default {
  // The install method will be called with the Vue constructor as
  // the first argument, along with possible options
  install (Vue, options = defaultOptions) {
    // console.log(options);

    // Set config
    const $i18n = {
      ...defaultOptions,
      // Merge in options
      ...options
    }

    // Detect language from messages
    $i18n.languages = Object.keys(options.messages)

    // Bind
    Vue.prototype.$i18n = Vue.observable($i18n)

    Vue.mixin({
      computed: {
        $t () {
          return function (key) {
            const { messages } = options
            const { locale } = this.$i18n
            return messages[locale][key]
          }
        },

        $tc () {
          return function (key, mixed = { count: 1 }) {
            const count = mixed.count ? mixed.count : mixed

            // Settings
            const { countTag, countSeperator } = options

            const { messages } = options
            const { locale } = this.$i18n
            const translation = messages[locale][key]
            const resp = translation.split(countSeperator)

            // Translation not set
            if (!resp.length) return key

            // Replace count tag
            return resp[count > 1 ? 1 : 0].replace(countTag, count)
          }
        }
      }

    })
  }
}
