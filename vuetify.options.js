import colors from 'vuetify/es5/util/colors'
import {
  mdiAlert,
  mdiCheckCircle,
  mdiClose,
  mdiDownload,
  mdiHome
} from '@mdi/js'

export default {
  icons: {
    iconfont: 'mdiSvg',
    values: {
      mdiAlert,
      mdiCheckCircle,
      mdiClose,
      mdiDownload,
      mdiHome
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
