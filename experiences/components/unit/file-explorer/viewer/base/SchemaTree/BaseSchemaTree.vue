<template>
  <VCard
    v-if="validSchema"
    outlined
    hover
    class="ma-3"
    :dark="selected"
    @click="clickOnCard"
    @click.stop=""
  >
    <VCardTitle>
      {{ schema.fieldName || schema.fileName }}
      <VSpacer />
      <VChip
        outlined
        color="primary"
        :disabled="schema['@type'] === null"
        link
        :href="schema['@type']"
        target="_blank"
      >
        {{ schema['@type'] || 'Unknow' }}
      </VChip>
    </VCardTitle>
    <VCardSubtitle>
      {{ schema['description'] }}
    </VCardSubtitle>
    <VCardText>
      <BaseSchemaTree
        v-for="child in schema.contains"
        :key="child.absolutePath"
        ref="childs"
        :schema="child"
      />
    </VCardText>
  </VCard>
</template>
<script>
import { mapState } from 'vuex'
import { isEmpty } from 'lodash-es'
import EventBus from './eventBus'

export default {
  name: 'BaseSchemaTree',
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selected: false
    }
  },
  computed: {
    ...mapState(['selectedPaths']),
    validSchema() {
      return !isEmpty(this.schema)
    },
    isLeaf() {
      return !this.schema.contains?.length
    }
  },
  created() {
    // Sets up the Event Bus listener
    EventBus.$on('change', this.pathsChanged)
  },
  destroyed() {
    // Removes Event Bus listener upon removal
    EventBus.$off('change', this.pathsChanged)
  },
  methods: {
    // Invert current state
    clickOnCard() {
      this.selected = !this.selected
      this.updateSelectedPaths()
      EventBus.$emit('change', { path: this.schema.absolutePath || '$', selected: this.selected })
    },
    pathsChanged(value) {
      // if a parent has been modify, update current children
      if (this.schema.absolutePath && value.path === this.schema.absolutePath.slice(0, value.path.length)) {
        this.selected = value.selected
        this.updateSelectedPaths()
      }
    },
    // Update list of leafs selected
    updateSelectedPaths() {
      if (this.isLeaf) {
        if (this.selected) {
          this.$store.commit('selectPath', this.schema.absolutePath)
        } else {
          this.$store.commit('unselectPath', this.schema.absolutePath)
        }
      }
    }
  }
}
</script>
