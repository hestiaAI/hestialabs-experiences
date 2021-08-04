<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :hide-default-footer="!headers.length"
  >
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
