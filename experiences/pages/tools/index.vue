<template>
  <VContainer>
    <h1 class="mt-6 mb-4 text-h4">
      <VIcon x-large>
        $vuetify.icons.mdiTools
      </VIcon>
      <span>{{ $tc('Tool', 2) }}</span>
    </h1>
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
