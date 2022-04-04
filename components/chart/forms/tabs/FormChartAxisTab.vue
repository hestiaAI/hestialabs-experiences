<template>
  <VContainer>
    <VRow dense>
      <VCol>
        <VTextField
          v-model="xLabel"
          label="Label x-axis"
          hint="Please enter a label for the x-axis"
          type="text"
          @change="change()"
        ></VTextField>
      </VCol>
    </VRow>
    <VRow dense>
      <VCol>
        <VTextField
          v-model="yLabel"
          label="Label y-axis"
          hint="Please enter a label for the y-axis"
          type="text"
          @change="change()"
        ></VTextField>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
export default {
  data() {
    return {
      xLabel: null,
      yLabel: null
    }
  },
  methods: {
    change() {
      this.$emit('change', {
        xLabel: this.xLabel,
        yLabel: this.yLabel
      })
    }
  }
}
</script>
