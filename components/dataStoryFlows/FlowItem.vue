<template>
  <VRow align="center" justify="center">
    <VCol cols="2" style="text-align: center">
      <slot name="opposite"></slot>
    </VCol>
    <VCol
      cols="4"
      style="text-align: center"
      :class="{
        'd-flex': inputs.length > 1,
        'justify-space-around': inputs.length > 1
      }"
    >
      <VAvatar
        v-for="input in inputs"
        :id="input.id"
        :key="input.id"
        class="ma-4 pa-4"
        color="primary"
        text-color="white"
        size="48"
      >
        <VIcon large dark>
          {{ getIcon(input.logo) }}
        </VIcon>
      </VAvatar>
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
