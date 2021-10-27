<template>
  <p>csv viewer</p>
</template>

<script>
export default {
  name: 'UnitCsvViewer',
  props: {
    csv: {
      type: String,
      required: true
    }
  }
}
</script>
