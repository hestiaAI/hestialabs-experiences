<template>
  <div v-if="loading">Loading</div>
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

export default {
  name: 'UnitJsonViewer',
  props: {
    file: {
      type: File,
      required: true
    },
    preprocessorFunc: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      idSpace: 0,
      jsonText: '',
      items: [],
      loading: true
    }
  },
  watch: {
    file: {
      async handler(newFile) {
        await this.getItemsFromFile(newFile)
      },
      immediate: true
    }
  },
  methods: {
    async getItemsFromFile(file) {
      this.loading = true
      this.jsonText = this.preprocessorFunc(await file.text())
      this.items = [this.itemify(JSON.parse(this.jsonText))]
      this.loading = false
    },
    itemify(tree) {
      if (typeof tree !== 'object')
        return { value: tree, icon: mdiInformationOutline }
      else if (Array.isArray(tree)) {
        const list = tree.flatMap(el => {
          return this.itemify(el)
        })
        if (list.length === 1 && list[0].name) {
          return {
            id: this.idSpace++,
            name: `[list with ${list.length} item] / ${list[0].name}`,
            children: list[0].children,
            icon: list[0].icon
          }
        } else {
          return {
            id: this.idSpace++,
            name: `[list with ${list.length} items]`,
            children: list,
            icon: mdiFormatListBulletedSquare
          }
        }
      } else {
        const obj = Object.entries(tree).flatMap(([key, v]) => {
          const inner = this.itemify(v)
          if (typeof inner.name === 'undefined') {
            return { ...inner, name: lodash.startCase(key) }
          } else {
            return {
              ...inner,
              name: `${lodash.startCase(key)} / ${inner.name}`
            }
          }
        })
        if (obj.length === 1) {
          return obj[0]
        } else {
          return {
            id: this.idSpace++,
            name: `{object with ${obj.length} keys}`,
            children: obj,
            icon: mdiCodeJson
          }
        }
      }
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
