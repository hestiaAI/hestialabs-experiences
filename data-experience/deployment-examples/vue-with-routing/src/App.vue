<template>
  <VApp>
    <VMain>
      <TheNavBar />
      <RouterView/>
    </VMain>
  </VApp>
</template>

<script>
import TheNavBar from '@/components/TheNavBar.vue'

export default {
  components: {
    TheNavBar
  }
}
</script>
