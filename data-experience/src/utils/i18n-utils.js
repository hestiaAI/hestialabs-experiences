export function kViewBlockPrefix(experienceNameAndTag, viewBlockId) {
  return `experiences.${experienceNameAndTag}.viewBlocks.${viewBlockId}`
}

export function mergeMessagesIntoI18n(i18n, locale, localeMessagesList) {
  localeMessagesList.forEach((messages) => {
    if (messages) {
      i18n.mergeLocaleMessage(locale, messages)
    }
  })
}

export function nestExperienceLocaleMessages(
  experienceNameAndTag,
  localeMessages
) {
  if (!experienceNameAndTag || !localeMessages) {
    return {}
  }
  return { experiences: { [experienceNameAndTag]: localeMessages } }
}

function injectIntoVuePrototype(Vue, key, value, ignoreConflicts) {
  try {
    Vue.prototype[key] = value
  } catch (err) {
    const message = `Conflict: ${key} is already injected in the host app, please change its name.`
    if (ignoreConflicts) {
      console.error(message)
    } else {
      throw new Error(message)
    }
  }
}

export function injectTranslationHelpersIntoVue(Vue, ignoreConflicts = false) {
  const inj = (k, v) => injectIntoVuePrototype(Vue, k, v, ignoreConflicts)
  inj('$tev',
    function(key, valueFallback) {
      // tev -> Translation Exists (else) Value fallback
      return this.$te(key) ? this.$t(key) : valueFallback
    })
  inj('$tet',
    function(key, keyFallback) {
      // tet -> Translation Exists (else) Translate fallback
      return this.$te(key) ? this.$t(key) : this.$t(keyFallback)
    })
  inj('$days',
    function() {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(v => this.$t(`dayOfWeek.${v}`))
    })
}

export function experienceNameFromTitle(title) {
  return title.replace(/\s/g, '_').toLowerCase()
}
