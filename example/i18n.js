import Vue from 'vue'
import vueTinyTrans from './vue-tiny-trans'

function autoloadMessages () {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

function flattenObject (obj, parent = '', res = {}, separator = '_') {
  for (const key in obj) {
    const propName = parent ? `${parent}${separator}${key}` : key
    if (typeof obj[key] === 'object') {
      flattenObject(obj[key], propName, res, separator)
    } else {
      res[propName] = obj[key]
    }
  }
  return res
}

// Load
const locales = autoloadMessages()

// Flatten all locales
const flattenMessages = {}
Object.entries(locales).map(([key, messages]) => {
  flattenMessages[key] = flattenObject(messages, '', {}, '__')
})

Vue.use(vueTinyTrans, {
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: flattenMessages,

  // Custom getKey function
  getKey (key, ctx = {}) {
    const {
      messages = {},
      locale,
      ns = '',
      keySeparator = '__',
      context = '' // E.g. male or female ...
    } = ctx

    const prefix = `${ns ? `${ns}${keySeparator}` : ''}`
    const finalKey = `${prefix}${key}${context ? `_${context}` : ''}`
    const translations = messages[locale] || {}
    const translation = translations[finalKey] || ''
    return translation
  },

  // Custom missingKey function
  onMissingKey (key, { locale, fallbackLocale, ns }) {
    console.warn(`Missing key: ${key}`, `(${locale}), domain: ${ns}`, flattenMessages)

    // // Try fallbackLocale
    const resp = flattenMessages[fallbackLocale][key] ||
      key // Or fallback to key

    console.warn('Falling back to:', resp)
    return resp
  }
})
