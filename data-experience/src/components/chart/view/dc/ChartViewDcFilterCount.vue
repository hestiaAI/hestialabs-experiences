<template>
  <VRow>
    <template v-if="filterCount === totalCount">
      <i18n tag="div" :path="kViewBlock('selected-all')">
        <template #totalCount>
          <span class="font-weight-bold" v-text="totalCount" />
        </template>
        <template v-if="rowLabel" #rowLabel>
          {{ rowLabel }}
        </template>
      </i18n>
      <span v-t="'click-graph'" />
    </template>
    <template v-else>
      <i18n tag="div" :path="kViewBlock('selected-some')">
        <template v-for="(v, k) in { filterCount, totalCount }" #[k]>
          <span :key="k" class="font-weight-bold" v-text="v" />
        </template>
        <template v-if="rowLabel" #rowLabel>
          {{ rowLabel }}
        </template>
      </i18n>
      <span>&nbsp;| <a v-t="'Reset All'" @click="resetAll" /></span>
    </template>
  </VRow>
</template>

<script>
import * as dc from 'dc'

import kViewBlockMixin from '@/mixins/k-view-block'

export default {
  mixins: [kViewBlockMixin],
  props: {
    filterCount: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    rowLabel: {
      type: String,
      default: null
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    }
  }
}
</script>
