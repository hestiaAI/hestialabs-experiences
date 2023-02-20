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

export function nestExperienceLocaleMessages(experienceNameAndTag, localeMessages) {
  return { experiences: { [experienceNameAndTag]: localeMessages } }
}
