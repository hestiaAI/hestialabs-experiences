// https://kazupon.github.io/vue-i18n/guide/datetime.html
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

export const dateTimeFormats = {
  en: {
    dateOnly: {
      dateStyle: 'long'
    },
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  fr: {
    dateOnly: {
      dateStyle: 'long'
    },
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}
