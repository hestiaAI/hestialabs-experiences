<template>
  <VCard
    height="100%"
    nuxt
    :to="localePath({ name: 'space-bubble', params: { bubble: slug } })"
    hover
  >
    <VCardText>
      <VAvatar
        size="200"
        tile
      >
        <VImg :src="icon" :lazy-src="icon" contain />
      </VAvatar>
      <h4 class="text-subtitle-1 font-weight-bold">
        {{ title }}
      </h4>
      <p>{{ description }}</p>
    </VCardText>
  </VCard>
</template>

<script>
export default {
  name: 'BaseBubbleCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    slug: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
