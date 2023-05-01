
<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="8">
        <h3 class="text-h3 font-weight-bold blue-grey--text text--darken-2 mt-6 mb-10 text-center">
          Graph Generator
        </h3>
        <p class="text-h5 blue-grey--text text--darken-2 mt-6 mb-6">
          Display interactive graphs
        </p>
        <VSelect
          v-model="selectedGraph"
          :items="graphs"
          label="Select a Graph"
          solo
          class="text-center"
          item-text="name"
          return-object
        />
      </VCol>
    </VRow>
    <VRow justify="center">
      <VCol cols="12" md="8">
        <NetworkGraph v-if="graphValues" v-bind="{...graphValues}" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import NetworkGraph from '@/components/NetworkGraph.vue'
export default {
  name: 'Graphulator',
  components: {
    NetworkGraph
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
      console.log('newValues', newValues)
      this.graphValues = {
        nodes: newValues.nodes.map(node => ({
          id: node.node_id.id,
          label: node.node_id.name,
          size: node.node_id.size,
          color: node.node_id.color
        })),
        edges: newValues.edges.map(edge => ({
          id: edge.edge_id.id,
          source: edge.edge_id.source,
          target: edge.edge_id.target,
          label: edge.edge_id.name,
          color: edge.edge_id.color
        }))
      }
      console.log(this.graphValues)
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
