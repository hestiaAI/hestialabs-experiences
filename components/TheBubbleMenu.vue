<template>
  <VList rounded>
    <VListItem
      v-for="({ title, icon }, slug) in $store.state.config.bubbleConfig"
      :key="slug"
      nuxt
      :to="{ name: 'bubble-bubble', params: { bubble: slug } }"
      exact
    >
      <VListItemAvatar tile>
        <VImg :src="icon" :lazy-src="icon" />
      </VListItemAvatar>
      <VListItemContent>
        <VListItemTitle v-text="title" />
      </VListItemContent>
    </VListItem>
  </VList>
</template>
