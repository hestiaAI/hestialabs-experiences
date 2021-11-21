<template>
  <VSelect
    v-bind="$attrs"
    item-text="name"
    item-value="name"
    style="max-width: 150px"
    hide-details
    label="Select query"
    return-object
    @change="$emit('change', $event)"
  />
</template>
