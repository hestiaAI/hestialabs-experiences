<template>
  <div v-if="bubbles.length">
    <h4 class="mt-6 mb-4 text-h4">
      {{ $tc('Bubble', 2) }}
    </h4>
    <VList rounded>
      <VListItem
        v-for="({ title, icon, slug }) in bubbles"
        :key="slug"
        nuxt
        :to="localePath({ name: 'bubble-bubble', params: { bubble: slug } })"
      >
        <VListItemAvatar tile>
          <VImg :src="icon" :lazy-src="icon" />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>{{ title }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </div>
</template>
<script>
import { pick } from 'lodash-es'

export default {
  computed: {
    bubbles() {
      return Object.entries(this.$store.state.config.bubbleConfig).map(([slug, conf]) => {
        const config = pick(conf, [
          'title',
          'icon'
        ])
        return { slug, ...config }
      }).filter(w => !(this.$store.state.config.homePageBubbles || []).includes(w.slug))
    }
  }
}
</script>
