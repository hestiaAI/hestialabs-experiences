<template>
  <VMenu v-if="$i18n.locales.length > 1" offset-y>
    <template #activator="menu">
      <VTooltip bottom>
        <template #activator="tooltip">
          <VBtn
            icon
            v-bind="{ ...menu.attrs, ...tooltip.attrs }"
            v-on="{ ...menu.on, ...tooltip.on }"
          >
            <VIcon>$vuetify.icons.mdiTranslate</VIcon>
          </VBtn>
        </template>
        <span v-t="'Language'" />
      </VTooltip>
    </template>
    <VList>
      <VListItem
        v-for="({ code, name }) in $i18n.locales"
        :key="code"
        nuxt
        :to="switchLocalePath(code)"
      >
        <VListItemTitle>{{ name }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>
<script>
export default {
  name: 'LocalesMenu'
}

</script>
