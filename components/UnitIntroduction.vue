<template>
  <div>
    <h1>Analyze your private data</h1>
    <p class="body-1">
      Request the private data that {{ companyName }} collected on you. Once you
      receive it, analyze it here.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    companyName: {
      type: String,
      default: ''
    }
  }
}
</script>
