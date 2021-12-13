<template>
  <div>
    <h2 v-if="section.title" class="mb-4">{{ section.title }}</h2>

    <template v-if="section.description">
      <!-- For security reasons, HTML is not rendered on zip import -->
      <p v-if="readonly">
        {{ section.description }}
      </p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-else v-html="section.description"></p>
    </template>

    <template v-if="section.type === 'data' && !section.hide">
      <VCheckbox
        v-for="(title, j) in section.titles"
        :key="`data-${j}`"
        v-model="includedResults"
        :readonly="readonly"
        dense
        :disabled="dataCheckboxDisabled[j]"
        :label="title"
        :value="section.keys[j]"
        @change="updateConsent"
      ></VCheckbox>

      <p v-if="readonly" class="mb-4">
        Individual files (<b>{{ selectedFiles.length }}</b> selected)
      </p>
      <VDialog v-else v-model="dialog" width="80%">
        <template #activator="{ on }">
          <div>
            <span class="mr-2"
              >Individual files (<b>{{ selectedFiles.length }}</b>
              selected):</span
            >
            <BaseButton class="mb-4" text="Select files" v-on="on" />
          </div>
        </template>

        <VDivider></VDivider>

        <VCard>
          <VCardTitle class="text-h5 grey lighten-2"> Select files </VCardTitle>

          <UnitFileExplorer v-bind="{ fileManager, selectable: true }" />

          <VDivider></VDivider>

          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn color="primary" text @click="dialog = false"> OK </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <VCheckbox
        v-for="(title, j) in section.additional"
        :key="`data-additional-${j}`"
        v-model="includedResults"
        :readonly="readonly"
        dense
        :label="title"
        :value="title"
        @change="updateConsent"
      ></VCheckbox>
    </template>

    <VRadioGroup
      v-if="section.type === 'radio'"
      v-model="selected"
      :readonly="readonly"
      @change="updateConsent"
    >
      <VRadio
        v-for="(option, j) in section.options"
        :key="`${index}-${j}`"
        :label="option"
        :value="option"
      ></VRadio>
    </VRadioGroup>

    <template v-if="section.type === 'checkbox'">
      <VCheckbox
        v-for="(option, j) in section.options"
        :key="`${index}-${j}`"
        v-model="selected"
        :label="option"
        :value="option"
        dense
        :readonly="readonly"
        @change="updateConsent"
      />
    </template>

    <VTextField
      v-if="section.type === 'input'"
      v-model="value"
      dense
      :readonly="readonly"
      :label="section.name"
      :placeholder="section.placeholder"
      @change="updateConsent"
    ></VTextField>

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
      @change="updateConsent"
    ></VTextarea>
  </div>
</template>

<script>
import FileManager from '~/utils/file-manager.js'

export default {
  props: {
    section: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    dataCheckboxDisabled: {
      type: Array,
      default: () => []
    },
    showDataExplorer: {
      type: Boolean,
      default: true
    },
    fileManager: {
      type: FileManager,
      required: true
    }
  },
  data() {
    return {
      selected: null,
      value: null,
      includedResults: null,
      dialog: false
    }
  },
  computed: {
    key() {
      return this.$route.params.key
    },
    selectedFiles() {
      if (this.readonly) {
        return Object.keys(this.fileManager.fileDict)
      }
      return this.$store.state.selectedFiles[this.key]
    }
  },
  created() {
    if ('selected' in this.section) {
      this.selected = this.section.selected
    } else if (this.section.type === 'checkbox') {
      this.selected = []
    } else if (this.section.type === 'radio') {
      this.selected = ''
    }

    if ('value' in this.section) {
      this.value = this.section.value
    } else if (
      this.section.type === 'input' ||
      this.section.type === 'multiline'
    ) {
      this.value = ''
    }

    if ('includedResults' in this.section) {
      this.includedResults = this.section.includedResults
    } else if (this.section.type === 'data') {
      this.includedResults = []
    }
  },
  methods: {
    updateConsent() {
      this.$emit('change', {
        index: this.index,
        selected: this.selected,
        value: this.value,
        includedResults: this.includedResults
      })
    }
  }
}
</script>
