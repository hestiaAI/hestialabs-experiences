<template>
  <VTooltip
    left
    max-width="200"
  >
    <template #activator="{ on, attrs }">
      <VHover>
        <VIcon
          color=""
          v-bind="attrs"
          v-on="on"
        >
          $vuetify.icons.mdiInformationOutline
        </VIcon>
      </VHover>
    </template>
    <span><slot /></span>
  </VTooltip>
</template>
<script>
export default {
  name: 'BaseInfoHover'
}
</script>
