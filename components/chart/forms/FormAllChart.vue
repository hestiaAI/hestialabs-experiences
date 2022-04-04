<template>
  <VContainer class="ma-3">
    <VForm ref="form" v-model="valid" lazy-validation>
      <VRow>
        <VCol>
          <VSelect
            v-model="select"
            :items="items"
            :rules="[v => !!v || 'Chart type is required']"
            label="Chart type to display"
            required
          ></VSelect>
        </VCol>
      </VRow>
      <VRow v-if="select">
        <VCol
          v-for="propName in Object.keys(props).filter(
            p => !['headers', 'values'].includes(p)
          )"
          :key="propName"
          cols="12"
          md="6"
        >
          <FormInput
            v-model="formValues[propName]"
            :name="propName"
            :prop-object="props[propName]"
            :headers="headers"
            @input="updateGraph"
          />
        </VCol>
      </VRow>
      <BaseButton
        :disabled="!valid"
        color="primary"
        class="mr-4"
        @click="updateGraph"
      >
        Draw Graph
      </BaseButton>

      <BaseButton color="error" class="mr-4" @click="reset">
        Reset Form
      </BaseButton>
    </VForm>
  </VContainer>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    formValues: {},
    valid: false,
    select: null,
    items: []
  }),
  computed: {
    props() {
      if (this.select)
        return this.$root.$options.components[this.select].options.props
      else return {}
    }
  },
  mounted() {
    const graphs = require.context(
      '@/components/chart/view/core',
      false,
      /^\.\/(.*)\.vue$/
    )
    this.items = graphs.keys().map(g => g.substring(2, g.length - 4))
  },
  methods: {
    updateGraph() {
      if (this.$refs.form.validate()) {
        this.$emit('submit', {
          graphName: this.select,
          graphProps: this.formValues
        })
      }
    },
    reset() {
      this.$refs.form.reset()
      this.$emit('submit', null)
    }
  }
}
</script>
