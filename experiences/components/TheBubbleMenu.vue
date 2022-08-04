<template>
  <div v-if="$store.state.config.bubbleConfig">
    <h4 class="mt-6 mb-4 text-h4">
      {{ $t('Bubbles') }}
    </h4>
    <VList rounded>
      <VListItem
        v-for="({ title, icon }, slug) in $store.state.config.bubbleConfig"
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
