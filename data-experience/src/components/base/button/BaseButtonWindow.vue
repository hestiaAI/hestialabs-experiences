<template>
  <BaseButton
    icon
    x-large
    :tooltipProps="{ right: true }"
    :outlined="false"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'BaseButtonWindow',
  components: {
    BaseButton
  }
}
</script>
