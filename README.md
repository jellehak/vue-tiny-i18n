# Lightweight translations for vue


# How to
```js
import vueTranslations from "@/plugins/vue-translations";
// import messages from "@/locales";
const messages = [
  en: {
    "Hello World": "Hello World"
  },
  nl: {
    "Hello World": "Hallo Wereld"
  }
]

Vue.use(vueTranslations, {
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages
});
```

# Usage
```js
$t("Hello World")

$tc("FormattedNumberOfLastDays", 3)
```

# Scanner
TODO


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
      <template v-slot:activator="{ on }">
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