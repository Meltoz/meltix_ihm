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
  hooks: {
    'pages:extend'(pages){
      function setMiddleware(pages: NuxtPage[]){
        for(const page of pages){
          if(page.path.startsWith('/admin')) {
            page.meta ||= {};
            page.meta.middleware ||= [];
            if(!page.meta.middleware.includes('admin')){
              page.meta.middleware.push('admin')
            }
          }
          if(!page.path.startsWith('/login')) {
            page.meta ||= {};
            page.meta.middleware ||= [];
            if(!page.meta.middleware.includes('auth')){
              page.meta.middleware.push('auth')
            }
          }
          if (page.children) {
            setMiddleware(page.children);
          }
        }
      }
      setMiddleware(pages);
    }
  },
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL,
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css', 'plyr/dist/plyr.css'],
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
