<template>
  <div v-if="bubbles.length">
    <h1 class="mt-6 mb-4 text-h4">
      <VAvatar rounded size="50" class="mr-2">
        <img src="/data-space.png">
      </VAvatar>
      <span>{{ $tc('Data Space', 2) }}</span>
    </h1>
    <VList rounded>
      <VListItem
        v-for="({ title, icon, slug }) in bubbles"
        :key="slug"
        nuxt
        :to="localePath({ name: 'space-bubble', params: { bubble: slug } })"
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
      const bubbleConfig = this.$store.state.config.bubbleConfig || {}
      return Object.entries(bubbleConfig).map(([slug, conf]) => {
        const config = pick(conf, [
          'title',
          'icon'
        ])
        return { slug, ...config }
      })
    }
  }
}
</script>
