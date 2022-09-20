<template>
  <div>
    <slot :data="data" />
  </div>
</template>

<script>
export default {
  props: {
    clonedResult: {
      type: Object,
      required: true
    },
    postprocessor: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      data: this.postprocessor(this.clonedResult)
    }
  }
}
</script>
