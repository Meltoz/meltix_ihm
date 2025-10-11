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
    'pages:resolved'(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          page.meta ||= {};
          page.meta.middleware ||= [];

          const middlewares = new Set(page.meta.middleware);

          // Admin
          if (page.path.startsWith('/admin')) {
            middlewares.add('admin');
          }

          // Onboarding
          if (!page.path.startsWith('/onboarding')) {
            middlewares.add('has-on-boarding');
          }

          // Auth
          if (!page.path.startsWith('/login') && !page.path.startsWith('/onboarding')) {
            middlewares.delete('auth');
            page.meta.middleware = ['auth', ...middlewares];
          } else {
            page.meta.middleware = [...middlewares];
          }

          if (page.children) {
            setMiddleware(page.children);
          }
        }
      }

      setMiddleware(pages);
    },
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
