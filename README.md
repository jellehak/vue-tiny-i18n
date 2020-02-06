# Intro
A lightweight, zero dependency and customizable translation plugin for Vue. It is quite similar to plugins like vue-i18n or vue-i18next.

# Installation
## Basic
```js
import vueTinyI18n from "vue-tiny-i18n";
// import messages from "@/locales";
const messages = [
  en: {
    "Hello World": "Hello World"
  },
  nl: {
    "Hello World": "Hallo Wereld"
  }
]

Vue.use(vueTinyI18n, {
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages
});
```

## All options
```js
Vue.use(vueTinyI18n, {
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
});
```

## Mount to different key
```js
Vue.use(vueTinyT, {
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages
}, "$trans");

```
# Usage
```js
$t("Hello World")

$tc("Last hour | Last {count} hours", 3)
```

# Language switch
```html
<script>
export default {
  data: (vm) => ({
    languages: vm.$i18n.languages,
  }),
  methods: {
    click(item) {
      this.$i18n.locale = item;
    }
  }
};
</script>

<template>
  <select v-model="$i18n.locale">
      <option v-for="(lang, i) in languages" :key="i" :value="lang">
        {{ lang }}
      </option>
    </select>
</template>
```

# Watch language changes
```js
  new Vue({
    watch: {
      '$i18n.locale'(newValue) {
        console.log(newValue);
        // Do something
      }
    }
  });
```