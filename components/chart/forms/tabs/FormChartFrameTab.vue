<template>
  <VContainer>
    <VRow dense>
      <VCol>
        <VTextField
          v-model="title"
          label="Title"
          hint="Please enter a title for the chart"
          type="text"
          @change="change()"
        ></VTextField>
      </VCol>
    </VRow>
    <VRow dense>
      <VCol>
        <VTextField
          v-model="subtitle"
          label="Subtitle"
          hint="Please enter a subtitle for the chart"
          type="text"
          @change="change()"
        ></VTextField>
      </VCol>
    </VRow>
    <VRow justify="center" dense>
      <VCol cols="12">
        <span class="overline text-bold">Margin</span>
      </VCol>
      <VCol v-for="k in Object.keys(margin)" :key="k" cols="3">
        <VTextField
          v-model="margin[k]"
          :label="k"
          type="number"
          @change="change()"
        ></VTextField>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VTextField
          v-model.number="svgScale"
          label="Scale"
          hint="Zoom in or out"
          type="number"
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
      title: '',
      subtitle: '',
      margin: { left: 70, top: 70, bottom: 70, right: 70 },
      svgScale: 10
    }
  },
  methods: {
    change() {
      this.$emit('change', {
        title: this.title,
        subtitle: this.subtitle,
        margin: this.margin,
        svgScale: this.svgScale
      })
    }
  }
}
</script>
