<template>
  <VAlert v-bind="{ type: 'info', ...$attrs }" rounded>
    <slot></slot>
  </VAlert>
</template>
