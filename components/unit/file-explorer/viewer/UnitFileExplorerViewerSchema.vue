<template>
  <div v-if="loading">
    Loading
  </div>
  <div v-else-if="error">
    <p>Could not find a schema for this file</p>
  </div>
  <div v-else>
    <VDataTable
      :headers="headers"
      :items="items"
      :items-per-page="50"
      class="elevation-1"
    />
  </div>
</template>

<script>
import mixin from './mixin'
import mixinLoading from './mixin-loading'

export default {
  name: 'UnitFileExplorerViewerRaw',
  mixins: [mixin, mixinLoading],
  data() {
    return {
      jsonSchema: '',
      loading: true,
      error: false,
      headers: [
        { text: 'Path', value: 'path' },
        { text: 'Type', value: 'foundType' },
        { text: 'Descriptive Type', value: 'descriptiveType' },
        { text: 'Unique', value: 'unique' },
        { text: 'Default', value: 'default' },
        { text: 'Description', value: 'description' },
        { text: 'Choices', value: 'choices' },
        { text: 'Regex', value: 'regex' }
      ],
      items: []
    }
  },
  watch: {
    filename: {
      async handler(filename) {
        await this.fetchSchema(filename)
      },
      immediate: true
    }
  },
  methods: {
    async fetchSchema(filename) {
      this.setLoading(true)
      try {
        const path = (await import('@/assets/data/Twitter_model.json')).default
        const response = await window.fetch(path)
        const jsonSchema = await response.json()
        const jsonSchemaKey = Object.keys(jsonSchema).filter(k => filename.endsWith(jsonSchema[k].filename))[0]
        const jsonSchemaFile = jsonSchema[jsonSchemaKey]
        const items = []
        this.visitNode(jsonSchemaFile, jsonSchemaKey, items)
        this.items = items
      } catch (e) {
        console.error(e)
        this.error = true
      }
      this.setLoading(false)
    },
    visitNode(node, nodeKey, array) {
      if (node) {
        const nodeValues = {
          path: nodeKey,
          foundType: node.foundType,
          descriptiveType: node.descriptiveType,
          unique: node.unique,
          default: node.default,
          description: node.description,
          choices: node.choices,
          regex: node.regex
        }
        array.push(nodeValues)
        Object.keys(node.traversal).forEach(k => this.visitNode(node.traversal[k], k, array))
      }
    }

  }
}
</script>
