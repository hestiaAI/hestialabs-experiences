<template>
  <div>
    <h1>Analyze your private data</h1>
    <p class="body-1">
      <template v-if="dataPortal">
        <a :href="dataPortal" target="_blank">Click here</a> to request
      </template>
      <template v-else> Request </template>
      the private data that {{ companyName }} collected on you. Once you receive
      it, analyze it here.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    companyName: {
      type: String,
      required: true
    },
    dataPortal: {
      type: String,
      default: ''
    }
  }
}
</script>
