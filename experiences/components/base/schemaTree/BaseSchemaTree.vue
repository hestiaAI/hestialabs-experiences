<template>
  <VCard
    v-if="validSchema"
    outlined
    :hover="isSelectable && !schema.fileName"
    class="ma-3"
    :dark="selected"
    :disabled="!isSelectable && !schema.fileName"
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
        :ref="child.absolutePath"
        :schema="child"
      />
    </VCardText>
  </VCard>
</template>

<script>

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
      selected: false,
      selectedPaths: {}
    }
  },
  computed: {
    validSchema() {
      return !isEmpty(this.schema)
    },
    isLeaf() {
      return !this.schema.contains?.length
    },
    isSelectable() {
      console.log(this.selectedPaths)
      const selectedPaths = Object.keys(this.selectedPaths).filter(p => this.selectedPaths[p])
      const ret = selectedPaths.every(p => this.validPaths(p, this.schema.absolutePath))
      console.log(selectedPaths, ret)
      return ret
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
    clickOnCard() {
      if (this.isSelectable) {
        this.selected = !this.selected
        // Emitting a custom-event via the Event Bus
        EventBus.$emit('change', { [this.schema.absolutePath]: this.selected })
      }
    },
    pathsChanged(path) {
      this.selectedPaths = { ...this.selectedPaths, ...path }
    },
    validPaths(path1, path2) {
      if (!path1 || !path2) { return true }
      const getNbArrays = path => [...path.matchAll(/\[(:?\*)\]/g)].length
      const smallerArray = getNbArrays(path1) < getNbArrays(path2) ? path1 : path2
      const equalIdx = smallerArray.lastIndexOf('[*]') || 0
      console.log('Validate', path1, path2, path1.slice(0, equalIdx) === path2.slice(0, equalIdx))
      return path1.slice(0, equalIdx) === path2.slice(0, equalIdx)
    }
  }
}
</script>
