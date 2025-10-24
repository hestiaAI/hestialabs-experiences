<template>
  <VAlert v-bind="{ type: 'info', ...$attrs }" rounded>
    <slot />
  </VAlert>
</template>
<script>
export default {
  name: 'BaseAlert'
}
</script>
