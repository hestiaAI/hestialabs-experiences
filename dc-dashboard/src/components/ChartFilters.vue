<template>
  <div>
    <span>
      {{ $t(k('current-filter')) }}
      <span class="filter" />
    </span>
    <a v-t="k('reset')" class="reset capitalize" style="display: none" />
  </div>
</template>

<script>

import TranslationMixin from '@/mixins/translation-mixin'

export default {
  mixins: [TranslationMixin]
}
</script>
<style scoped>
.reset {
  color: currentColor;
  margin-left: 1rem;
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 3px;
}
</style>
