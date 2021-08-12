<template>
  <div>
    <base-button @click="run">Run</base-button>
  </div>
</template>

<script>
// import yaml from 'js-yaml'

export default {
  props: {
    yarrrml: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  // computed: {
  //   json() {
  //     return yaml.load(this.yarrrml)
  //   }
  // },
  methods: {
    run() {
      // const json = yaml.load(this.yarrrml)
      // for (const json.mappings
      console.log('running...')
    }
  }
}
</script>
