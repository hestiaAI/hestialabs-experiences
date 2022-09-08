<template>
  <VAlert v-bind="{ type: 'info', ...$attrs }" rounded>
    <slot />
  </VAlert>
</template>
