import colors from 'vuetify/es5/util/colors'
import {
  mdiAlert,
  mdiCheckboxBlankOutline,
  mdiCheckCircle,
  mdiChevronLeft,
  mdiClose,
  mdiCloseBox,
  mdiDatabase,
  mdiDatabaseRemove,
  mdiDownload,
  mdiFacebook,
  mdiFileSearch,
  mdiHome,
  mdiMagnify,
  mdiMinusBox,
  mdiStepForward,
  mdiTwitter,
  mdiMinus,
  mdiCalendar
} from '@mdi/js'

export default {
  icons: {
    iconfont: 'mdiSvg',
    values: {
      mdiAlert,
      mdiCheckboxBlankOutline,
      mdiCheckCircle,
      mdiChevronLeft,
      mdiClose,
      mdiCloseBox,
      mdiDatabase,
      mdiDatabaseRemove,
      mdiDownload,
      mdiFacebook,
      mdiFileSearch,
      mdiHome,
      mdiMagnify,
      mdiMinusBox,
      mdiStepForward,
      mdiTwitter,
      mdiMinus,
      mdiCalendar
    }
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#58539e',
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
}
