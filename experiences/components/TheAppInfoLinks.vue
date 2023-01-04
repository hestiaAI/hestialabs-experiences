<template>
  <div class="d-flex align-center">
    <div v-for="link in appInfoLinks" :key="link.url">
      <VTooltip v-bind="tooltipProps">
        <template #activator="{ on, attrs }">
          <VBtn
            icon
            v-bind="{ ...link, ...attrs }"
            class="mr-0"
            v-on="on"
          >
            <VIcon>$vuetify.icons.{{ link.icon }}</VIcon>
          </VBtn>
        </template>
        <span v-t="link.name" />
      </VTooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tooltipProps: {
      type: Object,
      default: () => ({ bottom: true })
    }
  },
  data() {
    const appInfoLinks = this.$store.state.config.appInfoLinks?.map(l => ({
      ...l,
      ...(
        l.external
          ? {
              href: l.url,
              target: '_blank',
              rel: 'noreferrer noopener'
            }
          : {
              to: l.url
            }
      )
    })) || []

    return {
      appInfoLinks
    }
  }
}
</script>
