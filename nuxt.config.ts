import tailwindcss from '@tailwindcss/vite';
import type { NuxtPage } from '@nuxt/schema';

export default defineNuxtConfig({
  ssr: false,
  build: {
    transpile: ['three', 'gsap'],
  },
  plugins: [
    { src: '~/plugins/gsap.ts', mode: 'client', ssr: false },
    { src: '~/plugins/lenis.ts', mode: 'client', ssr: false },
  ],
  modules: ['@nuxtjs/i18n'],
  runtimeConfig: {
    public: {},
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
});
