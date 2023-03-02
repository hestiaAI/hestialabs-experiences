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
        :color="selectColor"
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
      <div class="d-flex mt-4">
        <div
          v-if="schema.unique"
          class="mr-5"
        >
          <span class="font-weight-bold mr-3">Unique values:</span>
          <VChip
            outlined
            label
            small
            :color="selectColor"
          >
            {{ schema.unique }}
          </VChip>
        </div>
        <div
          v-if="schema.default"
          class="mr-5"
        >
          <span class="font-weight-bold mr-3">Default value:</span>
          <VChip
            outlined
            label
            small
            :color="selectColor"
          >
            {{ schema.default }}
          </VChip>
        </div>
        <div
          v-if="schema.regex"
          class="mr-5"
        >
          <span class="font-weight-bold mr-3">Regex:</span>
          <VChip
            outlined
            label
            small
            :color="selectColor"
          >
            {{ schema.regex }}
          </VChip>
        </div>
        <div
          v-if="schema.choices"
          class="mr-5"
        >
          <span class="font-weight-bold mr-3">Choices:</span>
          <VChip
            v-for="(choice, idx) in schema.choices.split(',')"
            :key="choice + idx"
            class="ma-1"
            outlined
            label
            small
            :color="selectColor"
          >
            {{ choice }}
          </VChip>
        </div>
      </div>
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
import { mapState, mapGetters, mapMutations } from '@/utils/store-helper'
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
    ...mapGetters(['selectedPaths']),
    ...mapState({ clickedNode: 'fileExplorerClickedSchemaTreeNode' }),
    selectColor() {
      return this.selected ? 'normal' : 'primary'
    },
    validSchema() {
      return !isEmpty(this.schema)
    },
    isLeaf() {
      return !this.schema.contains?.length
    }
  },
  watch: {
    clickedNode(node) {
      this.pathsChanged(node)
    }
  },
  methods: {
    ...mapMutations(['setClickedSchemaTreeNode']),
    // Invert current state
    clickOnCard() {
      this.selected = !this.selected
      this.updateSelectedPaths()
      this.setClickedSchemaTreeNode({ path: this.schema.absolutePath || '$', selected: this.selected })
    },
    pathsChanged(value) {
      // if a parent has been modified, update current children
      if (this.schema.absolutePath && value.path === this.schema.absolutePath.slice(0, value.path.length)) {
        this.selected = value.selected
        this.updateSelectedPaths()
      }
    },
    // Update list of leaves selected
    updateSelectedPaths() {
      if (this.isLeaf) {
        if (this.selected) {
          this.$store.commit('xp/selectPath', this.schema.absolutePath)
        } else {
          this.$store.commit('xp/unselectPath', this.schema.absolutePath)
        }
      }
    }
  }
}
</script>
