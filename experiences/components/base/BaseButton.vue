<template>
  <VBtn
    :outlined="outlined"
    v-bind="$attrs"
    class="my-2 base-button"
    @click="$emit('click', $event)"
  >
    <VIcon v-if="mdiIcon" :left="text !== ''">
      {{ mdiIconResolved }}
    </VIcon>
    <slot>
      <span>{{ $tev(text, text) }}</span>
    </slot>
  </VBtn>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: ''
    },
    mdiIcon: {
      type: String,
      default: null
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    mdiIconResolved() {
      return this.$vuetify.icons.values[this.mdiIcon]
    }
  }
}
</script>

<style scoped>
.v-btn {
  z-index: 4;
}
</style>
