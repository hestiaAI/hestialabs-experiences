<template>
  <VBtn
    :outlined="outlined"
    v-bind="[attrs, $attrs]"
    class="my-2"
    v-on="on"
    @click="$emit('click', $event)"
  >
    <VIcon v-if="icon" :left="text !== ''">
      {{ mdiIcon }}
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
    icon: {
      type: String,
      default: null
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    }
  }
}
</script>

<style scoped>
.v-btn {
  z-index: 4;
}
</style>
