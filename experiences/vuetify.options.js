// Add icons of the data-experiences module here
import { vuetifyOpts } from 'data-experience'
import {
  mdiAccount,
  mdiAccountGroup,
  mdiAlert,
  mdiAutorenew,
  mdiCached,
  mdiCalendar,
  mdiChartBar,
  mdiCheckboxBlankOutline,
  mdiCheckCircle,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCircleOutline,
  mdiCheckCircleOutline,
  mdiCircleSlice8,
  mdiClose,
  mdiCloseBox,
  mdiCloseCircle,
  mdiCog,
  mdiContentCopy,
  mdiDatabase,
  mdiDatabaseCog,
  mdiDatabaseRemove,
  mdiDelete,
  mdiDownload,
  mdiExport,
  mdiFileMultipleOutline,
  mdiFileSearch,
  mdiFileUpload,
  mdiFilter,
  mdiFolderInformationOutline,
  mdiFormatQuoteClose,
  mdiFormatQuoteOpen,
  mdiHelp,
  mdiHomeOutline,
  mdiInformationOutline,
  mdiLockOpenVariant,
  mdiMagnify,
  mdiMessageOutline,
  mdiMinus,
  mdiMinusBox,
  mdiNumeric1CircleOutline,
  mdiNumeric2CircleOutline,
  mdiPlus,
  mdiSend,
  mdiShare,
  mdiShieldLockOutline,
  mdiStepForward,
  mdiTable,
  mdiTextBoxEditOutline,
  mdiTranslate,
  mdiTuneVariant,
  mdiTwitter,
  mdiUpload,
  mdiWeb,
  mdiWhatsapp
} from '@mdi/js'

const values = {
  mdiAccount,
  mdiAccountGroup,
  mdiAlert,
  mdiAutorenew,
  mdiCached,
  mdiCalendar,
  mdiChartBar,
  mdiCheckboxBlankOutline,
  mdiCheckCircle,
  mdiCheckCircleOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCircleOutline,
  mdiCircleSlice8,
  mdiClose,
  mdiCloseBox,
  mdiCloseCircle,
  mdiCog,
  mdiContentCopy,
  mdiDatabase,
  mdiDatabaseCog,
  mdiDatabaseRemove,
  mdiDelete,
  mdiDownload,
  mdiExport,
  mdiFileMultipleOutline,
  mdiFileSearch,
  mdiFileUpload,
  mdiFilter,
  mdiFolderInformationOutline,
  mdiFormatQuoteClose,
  mdiFormatQuoteOpen,
  mdiHelp,
  mdiHomeOutline,
  mdiInformationOutline,
  mdiLockOpenVariant,
  mdiMagnify,
  mdiMessageOutline,
  mdiMinus,
  mdiMinusBox,
  mdiNumeric1CircleOutline,
  mdiNumeric2CircleOutline,
  mdiPlus,
  mdiSend,
  mdiShare,
  mdiShieldLockOutline,
  mdiStepForward,
  mdiTable,
  mdiTextBoxEditOutline,
  mdiTranslate,
  mdiTuneVariant,
  mdiTwitter,
  mdiUpload,
  mdiWeb,
  mdiWhatsapp
}

// If you need to access Nuxt context within the options file, you need to export a function instead
// https://github.com/nuxt-community/vuetify-module#optionspath
const optionsFunction = ({ app }) => ({
  icons: {
    iconfont: 'mdiSvg',
    values: { ...values, ...vuetifyOpts().icons.values }
  },
  theme: {
    options: {
      customProperties: true
    },
    dark: false,
    themes: {
      light: {
        primary: '#58539e',
        secondary: '#f39506',
        // Following colors are from the MUI default dark palette
        // https://mui.com/customization/palette/#default-values
        info: '#0288d1',
        warning: '#f57c00',
        error: '#d32f2f',
        success: '#388e3c'
      }
    }
  },
  lang: {
    // https://vuetifyjs.com/en/features/internationalization/#vue-i18n
    t: (key, ...params) => app.i18n.t(key, params)
  }
})

export default optionsFunction
