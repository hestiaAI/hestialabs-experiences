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
  watch: {
    selectedPaths(newPaths) {
      console.log(newPaths)
      // if (this.schema.absolutePath && path === this.schema.absolutePath.slice(0, path.length)) {
      //  this.selected = selected
      //  this.updateSelectedPaths()
      // }
    }
  },
  methods: {
    clickOnCard() {
      this.selected = !this.selected
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
