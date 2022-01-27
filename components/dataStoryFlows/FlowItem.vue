<template>
  <VRow align="center" justify="center">
    <VCol cols="2" style="text-align: center">
      <slot name="opposite"></slot>
    </VCol>
    <VCol cols="4" style="text-align: center">
      <VChip
        v-for="input in inputs"
        :id="input.id"
        :key="input.id"
        class="ma-4"
        color="indigo"
        text-color="white"
      >
        <VIcon fab large>
          {{ getIcon(input.logo) }}
        </VIcon>
      </VChip>
    </VCol>
    <VCol cols="6">
      <slot name="content"></slot>
    </VCol>
  </VRow>
</template>
<script>
export default {
  props: {
    inputs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getIcon(iconName) {
      return this.$vuetify.icons.values[iconName]
    }
  }
}
</script>
