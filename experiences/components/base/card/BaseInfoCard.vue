<template>
  <VCard flat height="100%" class="d-flex flex-column">
    <VCardText>
      <VAvatar color="primary" size="80" class="mb-6">
        <VIcon dark class="pa-5">
          {{ mdiIcon }}
        </VIcon>
      </VAvatar>
      <h4 class="text-subtitle-1 font-weight-bold">
        {{ title }}
      </h4>
      <p class="mt-3 mb-3">
        {{ text }}
      </p>
    </VCardText>
    <VSpacer />
    <VCardActions v-if="actionText">
      <VBtn
        text
        color="primary"
        :href="actionHref"
      >
        {{ actionText }}
      </VBtn>
    </VCardActions>
  </VCard>
</template>
<script>
export default {
  name: 'BaseInfoCard',
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      default: ''
    },
    actionHref: {
      type: String,
      default: ''
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    }
  },
  method: {
    scrollToElement() {
      const el = this.$refs.scrollToMe

      if (el) {
      // Use el.scrollIntoView() to instantly scroll to the element
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>
