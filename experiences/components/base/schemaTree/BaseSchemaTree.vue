<template>
  <VCard
    v-if="validSchema"
    outlined
    :hover="isSelectable"
    :ripple="isSelectable"
    class="ma-3"
    :dark="selected"
    v-on="isSelectable ? { click: clickOnCard } : {}"
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

import { isEmpty } from 'lodash-es'
// import EventBus from './eventBus'

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
      isMounted: false
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
      // const selectedPaths = this.$store.getters.selectedPaths
      // const currentValid = selectedPaths.every(p => this.validPaths(p, this.schema.absolutePath))
      // const childrensValid = this.isMounted && this.$refs.childs ? this.$refs.childs.every(c => c.isSelectable) : true
      return true// currentValid && childrensValid
    }
  },
  mounted() {
    this.isMounted = true
  },
  created() {
    // Sets up the Event Bus listener
    // EventBus.$on('change', this.pathsChanged)
  },
  destroyed() {
    // Removes Event Bus listener upon removal
    // EventBus.$off('change', this.pathsChanged)
  },
  methods: {
    updateSelectedPaths() {
      if (this.isLeaf) {
        if (this.selected) {
          this.$store.commit('selectPath', this.schema.absolutePath)
        } else {
          this.$store.commit('unselectPath', this.schema.absolutePath)
        }
      }
    },
    clickOnCard() {
      this.selected = !this.selected
      this.updateSelectedPaths()
      // Emitting current change via the Event Bus
      // EventBus.$emit('change', { path: this.schema.absolutePath || '$', selected: this.selected })
    },
    // pathsChanged({ path, selected }) {
    //  if (this.schema.absolutePath && path === this.schema.absolutePath.slice(0, path.length)) {
    //    this.selected = selected
    //    this.updateSelectedPaths()
    //  }
    // },
    // Check that arrays from path1 and path2 are all in the same tree branch
    validPaths(path1, path2) {
      if (!path1 || !path2) { return false }
      const getNbArrays = path => [...path.matchAll(/\[(:?\*)\]/g)].length
      const smallerArray = getNbArrays(path1) < getNbArrays(path2) ? path1 : path2
      const equalIdx = smallerArray.lastIndexOf('[*]') || 0
      return path1.slice(0, equalIdx) === path2.slice(0, equalIdx)
    }
  }
}
</script>
