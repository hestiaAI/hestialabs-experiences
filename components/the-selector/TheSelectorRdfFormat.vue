<template>
  <VSelect
    v-model="model"
    :items="items"
    item-value="toRDF"
    return-object
    hide-details
    label="Select format"
    style="max-width: 150px"
    @change="$emit('update:value', $event)"
  />
</template>

<script>
export default {
  data() {
    const items = [
      { text: 'N-Quads', toRDF: true, ext: 'nq' },
      { text: 'JSON-LD', toRDF: false, ext: 'jsonld' }
    ]
    return {
      items,
      model: items[0]
    }
  },
  created() {
    this.$emit('update:value', this.model)
  }
}
</script>
