import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const locale = (window.$wujie?.props?.locale as string) ?? 'zh'
const apiBaseUrl = (window.$wujie?.props?.apiBaseUrl as string) || ''

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${apiBaseUrl}/locales/{{lng}}/{{ns}}.json`,
    },
    lng: locale,
    fallbackLng: 'zh',
    defaultNS: 'operation',
    ns: ['operation'],
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  })

export default i18n
