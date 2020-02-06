# Intro
A lightweight, zero dependency and customizable translation plugin for Vue. Which is quite compatible to plugins like vue-i18n or vue-i18next.

# How to
```js
import vueTinyT from "vue-tiny-t";
// import messages from "@/locales";
const messages = [
  en: {
    "Hello World": "Hello World"
  },
  nl: {
    "Hello World": "Hallo Wereld"
  }
]

Vue.use(vueTinyT, {
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages
});
```

# How to ( advanced )
```js
Vue.use(vueTinyT, {
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

# Mount to different key
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
  <div>
    <v-menu offset-y>
      <template #activator="{ on }">
        <v-btn
          text
          v-on="on"
        >
          {{$i18n.locale}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in languages"
          :key="index"
          @click="click(item)"
        >
          <v-list-item-title>
            {{item}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
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