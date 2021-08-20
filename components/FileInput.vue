<template>
  <v-file-input v-bind="$attrs" @change="onChange"> </v-file-input>
</template>

<script>
export default {
  props: {
    handleChange: {
      type: Function,
      required: true
    }
  },
  methods: {
    async onChange(value) {
      if (value) {
        // enforce an Array of File objects:
        // files is an Array already if multiple attribute is provided
        const files = Array.isArray(value) ? value : [value]
        await this.handleChange(files)
      }
    }
  }
}
</script>
