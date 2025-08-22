import { createI18n } from 'vue-i18n';
import { defineNuxtPlugin } from 'nuxt/app';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'fr',
    messages: {
      en,
      fr,
    },
  });

  vueApp.use(i18n);
});
