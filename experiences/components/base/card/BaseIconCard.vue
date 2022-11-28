<template>
  <VCard v-bind="{...$attrs, color}" class="pa-2 ma-3" :style="cssProps">
    <div class="d-flex">
      <VIcon v-if="mdiIcon" :color="textColor">
        {{ mdiIcon }}
      </VIcon>
      <VImg v-else-if="icon" :src="icon" contain width="24px" />
      <span class="text-button card-text ml-3">{{ text }}</span>
    </div>
  </VCard>
</template>

<script>
export default {
  name: 'BaseIconCard',
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: 'white'
    },
    icon: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    mdiIcon() {
      console.log('TEST', this.$vuetify.icons.values[this.icon])
      return this.$vuetify.icons.values[this.icon]
    },
    cssProps() {
      return {
        '--color': this.textColor
      }
    }
  }
}
</script>

<style scoped>
.card-text {
  color: var(--color);
}

</style>
