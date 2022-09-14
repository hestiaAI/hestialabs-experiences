<template>
  <VTooltip left :disabled="!tooltip">
    <template #activator="{ on, attrs }">
      <VBtn
        :outlined="outlined"
        v-bind="[attrs, $attrs]"
        class="my-2"
        v-on="{ on, $on }"
        @click="$emit('click', $event)"
      >
        <VIcon v-if="icon" :left="text !== ''">
          {{ mdiIcon }}
        </VIcon>
        <slot>
          <span>{{ $t(text) }}</span>
        </slot>
        <BaseProgressCircular v-if="progress" class="ml-2" />
        <StatusIndicator v-else-if="status" :error="error" />
      </VBtn>
    </template>
    <span>{{ tooltip }}</span>
  </VTooltip>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    progress: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
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
