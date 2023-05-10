<template>
  <VStepper v-model="step">
    <VStepperHeader>
      <VStepperStep
        :complete="step > 1"
        step="1"
      >
        Add data
      </VStepperStep>
      <VDivider />
      <VStepperStep
        :complete="step > 2"
        step="2"
      >
        Filter
      </VStepperStep>
      <VDivider />
      <VStepperStep
        :complete="step > 3"
        step="3"
      >
        Fill your details
      </VStepperStep>
      <VDivider />
      <VStepperStep
        step="4"
      >
        Get your SAR
      </VStepperStep>
    </VStepperHeader>

    <VStepperItems>
      <VStepperContent step="1">
        <SarUploader v-model="files" />
        <VSpacer />
        <VBtn color="primary" @click="parseFiles">
          Suivant
        </VBtn>
      </VStepperContent>
      <VStepperContent step="2">
        <SarFilter :configs="lens_configs" />
        <VSpacer />
        <VBtn color="primary" @click="step = 3">
          Suivant
        </VBtn>
        <VBtn text @click="step = 1">
          Retour
        </VBtn>
      </VStepperContent>
      <VStepperContent step="3">
        <SarDetails />
        <VSpacer />
        <VBtn color="primary" @click="step = 4">
          Suivant
        </VBtn>
        <VBtn text @click="step = 2">
          Retour
        </VBtn>
      </VStepperContent>
      <VStepperContent step="4">
        <SarTemplate />
        <VSpacer />
        <VBtn color="primary">
          Send
        </VBtn>
        <VBtn text @click="step = 3">
          Retour
        </VBtn>
      </VStepperContent>
    </VStepperItems>
  </VStepper>
</template>
<script>
import { generateTable } from '@/utils/fileHelpers'
export default {
  name: 'SarBuilder',
  data() {
    return {
      loading: false,
      step: 1,
      files: [],
      lens_configs: [],
      filters: {}
    }
  },
  mounted() {
    this.fetchConfigs()
  },
  methods: {
    async fetchConfigs() {
      try {
        this.lens_configs = (await this.$directus.items('digipower_lens').readByQuery({
          fields: ['*', 'Tabulator_configs.Parsing_configs_id.*'],
          filter: {
            _and: [
              {
                frc_sar_input: {
                  _eq: 'to do'
                }
              },
              {
                'count(Tabulator_configs)': {
                  _neq: 0
                }
              }
            ]
          }
        })).data
      } catch (e) {
        console.error(e)
      }
    },
    async parseFiles() {
      this.loading = true
      this.lens_configs = (await Promise.all(this.lens_configs.map(async(lens) => {
        return {
          ...lens,
          values: await Promise.all(lens.Tabulator_configs.map(t => generateTable(this.files, t.Parsing_configs_id.config).catch(_ => null)))
        }
      }))).map((lens) => {
        return {
          ...lens,
          values: lens.values.find(a => a && a.items.length > 0)?.items
        }
      })

      this.loading = false
      this.step = 2
    }
  }
}
</script>
