<template>
  <div>
    <v-alert type="info">Default view coming soon</v-alert>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */

export default {
  props: {
    multiple: Boolean,
    files: Array,
    preprocessorFunc: Function,
    ext: String,
    examples: Array,
    data: Array
  }
}
</script>
