
<template>
  <VContainer class="mb-6">
    <VRow justify="center">
      <VCol cols="12" md="8">
        <p class="text-h5 blue-grey--text text--darken-2 mt-6 mb-6">
          Graph Generator
        </p>
        <VSelect
          v-model="selectedGraph"
          :items="graphs"
          label="Select a Graph"
          class="text-center"
          item-text="name"
          return-object
          outlined
        />
      </VCol>
    </VRow>
    <VRow justify="center">
      <VCol cols="12" md="8">
        <G6Graph v-if="graphValues" v-bind="{...graphValues}" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import G6Graph from '@/components/G6Graph.vue'
export default {
  name: 'Graphulator',
  components: {
    G6Graph
  },
  data() {
    return {
      graphs: [],
      selectedGraph: null,
      graphValues: null
    }
  },
  watch: {
    selectedGraph(newValues) {
      // Convert Directus format to our component needed format
      this.graphValues = {
        nodes: newValues.nodes.map(node => ({
          ...node.node_id,
          id: node.node_id.id.toString(),
          label: node.node_id.name,
          size: node.node_id.size.toString()
        })),
        edges: newValues.edges.map(edge => ({
          ...edge.edge_id,
          id: edge.edge_id.id.toString(),
          source: edge.edge_id.source.toString(),
          target: edge.edge_id.target.toString(),
          label: edge.edge_id.name
        }))
      }
    }
  },
  mounted() {
    this.fetchConfigs()
  },
  methods: {
    async fetchConfigs() {
      try {
        this.graphs = (await this.$directus.items('network_graph').readByQuery({
          fields: ['*', 'nodes.node_id.*', 'edges.edge_id.*']
        })).data
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped></style>
