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
        v-for="(k, j) in section.keys"
        :key="`data-${j}`"
        v-model="value"
        :readonly="readonly"
        dense
        :disabled="!!dataCheckboxDisabled[k]"
        :label="section.titles[j]"
        :value="k"
      ></VCheckbox>

      <VCheckbox
        v-model="value"
        :readonly="readonly"
        dense
        value="file-explorer"
        @change="changedFilesCheckbox"
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
      <SelectFilesDialog v-if="!readonly" v-model="showDialog" />
      <ShowFilesDialog v-else v-model="showDialog" />
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
      ></VRadio>
    </VRadioGroup>

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
    ></VTextarea>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    dataCheckboxDisabled: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  computed: {
    ...mapState(['consentForm']),
    ...mapGetters(['fileManager']),
    key() {
      return this.$route.params.key
    },
    selectedFiles() {
      if (this.readonly) {
        return Object.keys(this.fileManager.fileDict)
      }
      return this.$store.state.selectedFiles[this.key]
    },
    section() {
      return this.consentForm[this.index]
    },
    value: {
      get() {
        return this.section.value
      },
      set(value) {
        this.$store.commit('setConsentFormValue', { index: this.index, value })
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
