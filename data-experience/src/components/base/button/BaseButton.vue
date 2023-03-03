<template>
  <VTooltip
    v-bind="tooltipProps"
    :disabled="!tooltip"
  >
    <template #activator="{ on, attrs }">
      <VBtn
        :outlined="outlined"
        v-bind="[attrs, $attrs]"
        :class="vbtnClass"
        :style="vbtnStyle"
        v-on="on"
        @click="$emit('click', $event)"
      >
        <slot name="left" />
        <slot name="icon">
          <VIcon
            v-if="mdiIcon"
            :left="text !== ''"
          >
            {{ mdiIconResolved }}
          </VIcon>
        </slot>
        <slot>
          <span>{{ $tev(text, text) }}</span>
        </slot>
        <BaseProgressCircular
          v-if="progress"
          class="ml-2"
        />
        <BaseStatusIndicator
          v-else-if="status"
          :error="error"
        />
      </VBtn>
    </template>
    <span>{{ $tev(tooltip, tooltip) }}</span>
  </VTooltip>
</template>

<script>
import BaseStatusIndicator from '@/components/base/BaseStatusIndicator.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
export default {
  name: 'BaseButton',
  components: { BaseProgressCircular, BaseStatusIndicator },
  inheritAttrs: false,
  props: {
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
    mdiIcon: {
      type: String,
      default: null
    },
    outlined: {
      type: Boolean,
      default: true
    },
    vbtnClass: {
      type: [String, Object, Array],
      default: 'my-2 mr-2'
    },
    vbtnStyle: {
      type: [String, Object, Array],
      default: ''
    },
    // tooltip props
    tooltip: {
      type: String,
      default: ''
    },
    tooltipProps: {
      type: Object,
      default: () => ({ left: true })
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
