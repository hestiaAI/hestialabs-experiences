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

      <VCheckbox
        v-model="includedResults"
        :readonly="readonly"
        dense
        value="file-explorer"
        @change="updateFilesCheckbox"
      >
        <template #label>
          <span
            >Individual files (<a
              style="text-decoration: underline"
              @click="showDialog = true"
              ><b>{{ selectedFiles.length }}</b> selected</a
            >)</span
          >
        </template>
      </VCheckbox>
      <SelectFilesDialog
        v-if="!readonly"
        v-model="showDialog"
        :file-manager="fileManager"
        @return="returnDialog"
      />

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
      showDialog: false
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
    },
    returnDialog({ clear }) {
      if (clear) {
        this.includedResults = this.includedResults.filter(
          x => x !== 'file-explorer'
        )
      } else if (!this.includedResults.includes('file-explorer')) {
        this.includedResults.push('file-explorer')
      }
      this.updateConsent()
    },
    updateFilesCheckbox() {
      if (this.includedResults.includes('file-explorer')) {
        this.showDialog = true
      }
    }
  }
}
</script>
