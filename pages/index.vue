<template>
  <div>
    <h1>SITRA Demo</h1>

    <v-tabs class="mt-6">
      <v-tab>
        Tracker Control
      </v-tab>
      <v-tab-item class="mt-6">
        <experience
          identifier="tracker-control"
          ext="csv"
        />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style>
pre {
  white-space: pre-wrap;
  height: 300px;
  overflow-y: auto;
}

pre code {
  width: 100%;
}
</style>
