<template>
  <div>
    <h2
      v-if="section.title"
      class="mb-4"
    >
      {{ section.title }}
    </h2>

    <template v-if="section.description">
      <!-- For security reasons, HTML is not rendered on zip import -->
      <p v-if="readonly">
        {{ section.description }}
      </p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p
        v-else
        v-html="section.description"
      />
    </template>

    <template v-if="section.type === 'data' && !section.hide">
      <VCheckbox
        v-for="(k, j) in section.ids"
        :key="`data-${j}`"
        v-model="value"
        :readonly="readonly"
        dense
        :disabled="!readonly && !Object.keys(results).includes(k)"
        :label="section.titles[j]"
        :value="k"
      />
      <div v-if="!section.hideFileSelection">
        <VCheckbox
          v-model="value"
          :readonly="readonly"
          dense
          value="file-explorer"
          @change="changedFilesCheckbox"
        >
          <template #label>
            <span>Individual files (<a
              style="text-decoration: underline"
              @click="showDialog = true"
            ><b>{{ selectedFiles.length }}</b> selected</a>)</span>
          </template>
        </VCheckbox>
        <SelectFilesDialog
          v-if="!readonly"
          v-model="showDialog"
        />
        <ShowFilesDialog
          v-else
          v-model="showDialog"
        />
      </div>
    </template>

    <VRadioGroup
      v-if="section.type === 'radio'"
      v-model="value"
      :readonly="readonly"
    >
      <VRadio
        v-for="(option, j) in section.options"
        :key="`${index}-${j}`"
        :label="option"
        :value="option"
      />
    </VRadioGroup>

    <VSelect
      v-if="section.type === 'select'"
      v-model="value"
      :readonly="readonly"
      :items="section.options"
      :label="section.placeholder"
    />

    <template v-if="section.type === 'checkbox'">
      <VCheckbox
        v-for="(option, j) in section.options"
        :key="`${index}-${j}`"
        v-model="value"
        :label="option"
        :value="option"
        dense
        :readonly="readonly"
      />
    </template>

    <VTextField
      v-if="section.type === 'input'"
      v-model="value"
      dense
      :readonly="readonly"
      :label="section.name"
      :placeholder="section.placeholder"
    />

    <VTextarea
      v-if="section.type === 'multiline'"
      v-model="value"
      dense
      auto-grow
      outlined
      rows="3"
      :readonly="readonly"
      :label="section.name"
      :placeholder="section.placeholder"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store-helper'
import SelectFilesDialog from './SelectFilesDialog.vue'
import ShowFilesDialog from './ShowFilesDialog.vue'

export default {
  name: 'UnitConsentFormSection',
  components: { SelectFilesDialog, ShowFilesDialog },
  props: {
    index: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  computed: {
    ...mapState(['consentForm', 'fileManager', 'results']),
    selectedFiles() {
      if (this.readonly) {
        return Object.keys(this.fileManager.fileDict)
      }
      return this.$store.state.xp.selectedFiles
    },
    section() {
      return this.consentForm[this.index]
    },
    value: {
      get() {
        return this.section.value
      },
      set(value) {
        this.$store.commit('xp/setConsentFormValue', { index: this.index, value })
      }
    }
  },
  methods: {
    changedFilesCheckbox() {
      // Automatically open the dialog on select
      if (this.value.includes('file-explorer')) {
        this.showDialog = true
      }
    }
  }
}
</script>
