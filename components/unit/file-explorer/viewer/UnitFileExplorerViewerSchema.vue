<template>
  <div v-if="loading">
    Loading
  </div>
  <div v-else-if="error">
    <p>Could not find a schema for this file</p>
  </div>
  <div v-else>
    <VExpansionPanels
      v-model="panel"
      multiple
      class="pa-3"
    >
      <VExpansionPanel
        v-for="(item,i) in items"
        :key="i"
      >
        <VExpansionPanelHeader>
          <div class="d-flex justify-space-between">
            <span>{{ item.path }}</span>
            <VChip
              v-if="isEmpty(item['traversal'])"
              class="mr-2"
              color="green"
              outlined
              filter
              dense
              small
              :input-value="leafs[item.path]"
              @click="selectChip(item.path)"
            >
              Leaf
            </VChip>
          </div>
        </VExpansionPanelHeader>
        <VExpansionPanelContent>
          <VRow>
            <VCol v-for="header in headers" :key="header.value" sm="6" md="4" lg="3">
              <strong>{{ header.text }}:</strong> <span class="ml-1">{{ item[header.value] }}</span>
            </VCol>
          </VRow>
        </VExpansionPanelContent>
      </VExpansionPanel>
    </VExpansionPanels>
    <VBtn class="ma-3">
      Generate Tables
    </VBtn>
    <UnitFilterableTableFromAccessor v-bind="{filename, jsonPaths}" />
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
      leafs: {},
      loading: true,
      error: false,
      panel: [],
      headers: [
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
  computed: {
    jsonPaths() {
      const items = Object.keys(this.leafs).filter(k => this.leafs[k]).map(p => p.split(':')[1])
      console.log(items)
      return items
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
          regex: node.regex,
          traversal: node.traversal
        }
        array.push(nodeValues)
        Object.keys(node.traversal).forEach(k => this.visitNode(node.traversal[k], k, array))
      }
    },
    isEmpty(obj) {
      return obj && Object.keys(obj).length === 0
    },
    selectChip(path) {
      // this.leafs[path] = !this.leafs[path]
      this.$set(this.leafs, path, !this.leafs[path])
    }

  }
}
</script>
