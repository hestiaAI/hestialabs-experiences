<template>
  <client-only placeholder="Loading...">
    <!-- line numbers don't align correctly -->
    <prism-editor
      v-model="code"
      class="my-editor my-6"
      :line-numbers="false"
      :highlight="highlighter"
      :readonly="readonly"
      style="max-height: 300px"
    ></prism-editor>
  </client-only>
</template>

<script>
import { isError } from '@/lib/utils'

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css' // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'

import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-turtle'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-json'

// import syntax highlighting styles
import 'prismjs/themes/prism-tomorrow.css'

function processValue(v) {
  if (isError(v)) {
    return v.stack || v.toString()
  }

  return v
}

export default {
  components: {
    PrismEditor
  },
  props: {
    value: {
      type: [Object, String],
      default: ''
    },
    language: {
      type: String,
      default: 'text'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      code: processValue(this.value)
    }
  },
  computed: {
    editorLanguage() {
      // set editor language to 'text' if an error is being displayed
      return isError(this.value) ? 'text' : this.language
    }
  },
  watch: {
    value(v) {
      this.code = processValue(v)
    },
    code(v) {
      // propagate to parent component
      this.$emit('update:value', v)
    }
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages[this.editorLanguage])
    }
  }
}
</script>

<style>
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
