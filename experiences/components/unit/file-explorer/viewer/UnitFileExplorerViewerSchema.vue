<template>
  <div v-if="error">
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
            <span>{{ item.accessor.jsonPath }}</span>
            <VChip
              v-if="item.isLeaf"
              class="mr-2"
              color="green"
              outlined
              filter
              dense
              small
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
            <VCol cols="12">
              <UnitFilterableTableFromAccessor :accessor="item.accessor" />
            </VCol>
          </VRow>
        </VExpansionPanelContent>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<script>
import mixin from './mixin'
import { createAccessor } from '@/utils/accessor'
export default {
  name: 'UnitFileExplorerViewerRaw',
  mixins: [mixin],
  data() {
    return {
      jsonSchemaFile: {},
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
  watch: {
    filename: {
      async handler(filename) {
        await this.fetchSchema(filename)
      },
      immediate: true
    }
  },
  methods: {
    fetchSchema(filename) {
      try {
        const jsonSchema = this.$store.getters.experience(this.$route).dataModel
        const jsonSchemaKey = Object.keys(jsonSchema).filter(k => filename.endsWith(jsonSchema[k].filename))[0]
        this.jsonSchemaFile = jsonSchema[jsonSchemaKey]
        const items = []
        this.visitNode(this.jsonSchemaFile, jsonSchemaKey, items)
        this.items = items
      } catch (e) {
        console.error(e)
        this.error = true
      }
    },
    visitNode(node, nodeKey, array) {
      if (node) {
        const nodeValues = {
          accessor: createAccessor(...nodeKey.split(':')),
          foundType: node.foundType,
          descriptiveType: node.descriptiveType,
          unique: node.unique,
          default: node.default,
          description: node.description,
          choices: node.choices,
          regex: node.regex,
          traversal: node.traversal,
          isLeaf: this.isEmpty(node.traversal)
        }
        array.push(nodeValues)
        Object.keys(node.traversal).forEach(k => this.visitNode(node.traversal[k], k, array))
      }
    },
    isEmpty(obj) {
      return obj && Object.keys(obj).length === 0
    }
  }
}
</script>
