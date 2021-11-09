<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div>{{ jsonText }}</div>
  </div>
  <v-treeview v-else dense open-on-click transition :items="items">
    <template #prepend="{ item }">
      <v-icon v-if="typeof item.icon !== 'undefined'">
        {{ item.icon }}
      </v-icon>
    </template>
    <template #append="{ item }">
      <div
        v-if="typeof item.value !== 'undefined'"
        :title="item.value"
        class="hestia-treeview-json-value"
      >
        {{ item.value }}
      </div>
    </template>
  </v-treeview>
</template>

<script>
import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import lodash from 'lodash'
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitJsonViewer',
  props: {
    filename: {
      type: String,
      required: true
    },
    fileManager: {
      type: FileManager,
      required: true
    }
  },
  data() {
    return {
      jsonText: '',
      items: [],
      loading: true,
      error: false
    }
  },
  watch: {
    filename: {
      async handler(filename) {
        await this.getContentFromFilename(filename)
      },
      immediate: true
    }
  },
  methods: {
    async getContentFromFilename(filename) {
      this.loading = true
      this.jsonText = await this.fileManager.getPreprocessedText(filename)
      try {
        this.items = this.itemify(JSON.parse(this.jsonText))
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.loading = false
    },
    itemify(tree) {
      let id = 0
      function itemifyRec(tree) {
        id++
        if (typeof tree !== 'object') {
          return { value: tree, icon: mdiInformationOutline }
        } else if (Array.isArray(tree)) {
          const children = tree.flatMap(el => itemifyRec(el))
          const plural = children.length !== 1
          const name = `[list with ${children.length} item${plural ? 's' : ''}]`
          if (!plural && children[0].name) {
            return {
              id,
              name: `${name} / ${children[0].name}`,
              children: children[0].children,
              icon: children[0].icon
            }
          } else {
            return {
              id,
              name,
              children,
              icon: mdiFormatListBulletedSquare
            }
          }
        } else {
          const children = Object.entries(tree).flatMap(([key, v]) => {
            const inner = itemifyRec(v)
            const name = lodash.startCase(key)
            if (typeof inner.name === 'undefined') {
              return { ...inner, name }
            } else {
              return { ...inner, name: `${name} / ${inner.name}` }
            }
          })
          if (children.length === 1) {
            return children[0]
          } else {
            return {
              id,
              name: `{object with ${children.length} keys}`,
              children,
              icon: mdiCodeJson
            }
          }
        }
      }
      return [itemifyRec(tree)]
    }
  }
}
</script>

<style>
.v-treeview-node__append {
  max-width: calc(50%);
}
.hestia-treeview-json-value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
