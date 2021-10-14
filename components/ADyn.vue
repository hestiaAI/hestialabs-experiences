<template>
  <div>
    <h1>ADyn</h1>
    <component :is="isComponent" :title="title"></component>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'not really a title'
    },
    componentName: {
      type: String,
      required: true
    }
  },
  computed: {
    isComponent() {
      console.log(this.componentName)
      switch (this.componentName) {
        case 'A0':
          return () => import('@/components/A0.vue')
        case 'A1':
          return () => import('@/components/A1.vue')
        default:
          return undefined
      }
    }
  }
}
</script>
