<template>
  <div class="flowItem">
    <slot name="flowItemOpposite"></slot>
    <slot name="flowItemContent"></slot>
  </div>
</template>
<script>
export default {
  data: () => ({
    years: [
      {
        color: 'cyan',
        year: '1960'
      }
    ]
  })
}
</script>
