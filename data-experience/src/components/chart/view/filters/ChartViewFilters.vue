<template>
  <p class="filters">
    <span>
      {{ $t('Current filter') }}
      <span class="filter" />
    </span>
    <a
      v-t="'reset'"
      class="reset"
      style="display: none"
    />
  </p>
</template>

<script>
export default {

}
</script>
