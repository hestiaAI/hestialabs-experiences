<template>
  <p>pdf viewer</p>
</template>

<script>
export default {
  name: 'UnitPdfViewer',
  props: {
    pdf: {
      type: String,
      required: true
    }
  }
}
</script>
