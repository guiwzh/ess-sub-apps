import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

const locale =
  (window.__POWERED_BY_WUJIE__ ? (window.$wujie?.props?.locale as string) : undefined) ?? 'zh'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/api/locales/{{lng}}/{{ns}}.json',
    },
    lng: locale,
    fallbackLng: 'zh',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  })

export default i18n
