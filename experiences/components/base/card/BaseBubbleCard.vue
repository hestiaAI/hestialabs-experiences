<template>
  <VCard
    height="100%"
    nuxt
    :to="{ name: 'bubble-bubble', params: { bubble: slug } }"
    hover
  >
    <VCardText>
      <VImg :src="icon" :lazy-src="icon" />
      <h4 class="text-subtitle-1 font-weight-bold">
        {{ title }}
      </h4>
      <p>{{ description }}</p>
    </VCardText>
  </VCard>
</template>
<script>
export default {
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
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    }
  }
}
</script>
