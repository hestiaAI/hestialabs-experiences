<template>
  <v-select
    v-bind="$attrs"
    item-text="name"
    item-value="name"
    style="max-width: 150px"
    hide-details
    label="Select query"
    @change="
      $emit(
        'change',
        $attrs.items.find(i => i.name == $event)
      )
    "
  />
</template>
