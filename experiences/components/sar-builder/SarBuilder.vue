<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <VStepper v-model="step">
    <VStepperHeader>
      <VStepperStep :complete="step > 1" step="1">
        <span v-t="k('add-data')" />
      </VStepperStep>
      <VDivider />
      <VStepperStep :complete="step > 2" step="2">
        <span v-t="k('filter')" />
      </VStepperStep>
      <VDivider />
      <VStepperStep :complete="step > 3" step="3">
        <span v-t="k('infos')" />
      </VStepperStep>
      <VDivider />
      <VStepperStep step="4">
        <span v-t="k('send-sar')" />
      </VStepperStep>
    </VStepperHeader>

    <VStepperItems>
      <VStepperContent step="1">
        <SarUploader v-model="files" />
        <VSpacer />
        <BaseButton color="primary" v-bind="{loading}" @click="parseFiles">
          <span v-t="k('next')" />
        </BaseButton>
      </VStepperContent>
      <VStepperContent step="2">
        <SarFilter v-model="lens_configs" />
        <VSpacer />
        <BaseButton color="primary" @click="step = 3">
          <span v-t="k('next')" />
        </BaseButton>
        <BaseButton text @click="step = 1">
          <span v-t="k('back')" />
        </BaseButton>
      </VStepperContent>
      <VStepperContent step="3">
        <SarDetails v-model="details" />
        <VSpacer />
        <BaseButton color="primary" @click="generateSAR">
          <span v-t="k('next')" />
        </BaseButton>
        <BaseButton text @click="step = 2">
          <span v-t="k('back')" />
        </BaseButton>
      </VStepperContent>
      <VStepperContent step="4">
        <SarTemplate v-model="sar" />
        <VSpacer />
        <div class="d-flex">
          <BaseButton color="primary" mdi-icon="mdiSend" href="mailto:test@example.com?subject=Me&body=Hello!">
            <span v-t="k('send')" />
          </BaseButton>
          <BaseButton text @click="step = 3">
            <span v-t="k('back')" />
          </BaseButton>
          <VSpacer />
          <BaseButton color="primary" @click="step = 2">
            <span v-t="k('new-sar')" />
          </BaseButton>
        </div>
      </VStepperContent>
    </VStepperItems>
  </VStepper>
</template>
<script>
import { VSpacer } from 'vuetify/lib'
import { Liquid } from 'liquidjs'
import { generateTable } from '@/utils/fileHelpers'
export default {
  name: 'SarBuilder',
  components: { VSpacer },
  data() {
    return {
      loading: false,
      step: 1,
      files: [],
      lens_configs: [],
      details: {
        firstname: '',
        lastname: '',
        company: null
      },
      sar: {
        to: '',
        subject: '',
        body: 'test test test'
      }
    }
  },
  watch: {
    sar: {
      deep: true,
      handler() {
        console.log('updated sar', this.sar)
      }
    },
    details: {
      deep: true,
      handler() {
        console.log('updated details', this.details)
      }
    }
  },
  mounted() {
    this.fetchConfigs()
  },
  methods: {
    k(key) {
      return `sar-builder.${key}`
    },
    async fetchConfigs() {
      try {
        this.lens_configs = (await this.$directus.items('digipower_lens').readByQuery({
          fields: ['*', 'Tabulator_configs.Parsing_configs_id.*', 'SAR_template.*'],
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
        console.log(this.lens_configs)
      } catch (e) {
        console.error(e)
      }
    },
    async parseFiles() {
      this.loading = true
      this.lens_configs = await (await Promise.all(this.lens_configs.map(async(lens) => {
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

      console.log('Parsed: ', this.lens_configs)
      this.loading = false
      this.step = 2
    },
    async generateSAR() {
      this.loading = true

      const engine = new Liquid()
      this.sar.to = this.details.company?.email || ''
      this.sar.subject = 'Subject Access Request'
      const texts = await Promise.all(this.lens_configs.map(async(c) => {
        if (!c.selectedValues?.length) {
          return ''
        }
        return await engine.parseAndRender(c.SAR_template.text || '', { items: c.selectedValues } || { items: [] })
      }))

      console.log('texts', texts)

      this.sar.body = texts.join('\n')
      this.loading = false
      this.step = 4
    }
  }
}
</script>
