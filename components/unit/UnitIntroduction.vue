<template>
  <div>
    <h1>Analyze your private data</h1>
    <p v-if="isGenericViewer" class="body-1">
      Explore the structure and contents of any file.
    </p>
    <p v-else class="body-1">
      <template v-if="dataPortal">
        <a :href="dataPortal" target="_blank" rel="noreferrer noopener"
          >Click here</a
        >
        to request
      </template>
      <template v-else> Request </template>
      the private data that {{ companyName }} collected on you. Once you receive
      it, analyze it here.
    </p>
    <p>
      No data is transmitted to HestiaLabs or anyone else. The whole experience
      takes place locally in the browser and nothing is left behind as soon as
      you close the tab.
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
    },
    isGenericViewer: Boolean
  }
}
</script>
