<template>
  <VContainer class="mt-10">
    <h4 class="text-h4">
      <VIcon x-large>
        $vuetify.icons.mdiTools
      </VIcon>
      <span>{{ $tc('Tool', 2) }}</span>
    </h4>
    <VList rounded>
      <!-- https://zaengle.com/blog/named-routes-in-nuxt -->
      <VListItem
        v-for="({ name, path }) in links"
        :key="path"
        nuxt
        :to="localePath({ name: 'tools-' + path })"
      >
        <VListItemContent>
          <VListItemTitle>{{ $t(name) }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
      <VListItem
        href="https://personaldata.io/digipower-academy-questionnaire/"
        target="_blank"
      >
        <VListItemContent>
          <VListItemTitle>{{ $t("Data Spaces Creator") }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VContainer>
</template>

<script>
import mixinPage from '@/mixins/page'

export default {
  mixins: [mixinPage],
  data() {
    return {
      links:
    [
      { name: 'Sar builder', path: 'sar-builder' },
      { name: 'Tabulator', path: 'tabulator' },
      { name: 'Graphulator', path: 'graphulator' }
    ]
    }
  },
  head() {
    return this.vueMeta(this.$tc('Tools', 2))
  }
}
</script>
