<template>
  <AceEditor
    v-model="code"
    :lang="editorLanguage"
    theme="chrome"
    class="my-ace-editor"
    @init="initEditor"
  />
</template>

<script>
export default {
  name: 'CodeEditor',
  components: {
    AceEditor: () => import('vue2-ace-editor')
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [Object, String, Error],
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'text'
    },
    lineNumbers: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      code: this.value
    }
  },
  computed: {
    editorLanguage() {
      // set editor language to 'text' if an error is being displayed
      return this.error ? 'text' : this.language
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.code = v
      }
    },

    code(v) {
      // propagate to parent component
      this.$emit('input', v)
    }
  },
  methods: {
    initEditor(editor) {
      editor.setReadOnly(this.readonly)
      editor.setOption('showGutter', this.lineNumbers)
      editor.session.setUseWrapMode(true)
      // https://ace.c9.io/demo/autoresize.html
      editor.setOption('minLines', 2)
      editor.setOption('maxLines', 30)
      // editor.resize()

      // available modes:
      // https://github.com/ajaxorg/ace/tree/master/lib/ace/mode
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/javascript') // language
      require('brace/mode/json') // language
      require('brace/mode/sparql')
      require('brace/mode/yaml')
      require('brace/mode/turtle')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') // snippet
      require('brace/ext/searchbox')
    }
  }
}
</script>

<style scoped>
.my-ace-editor {
  /* you can provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 16px;
  line-height: 1.5;
}
</style>
