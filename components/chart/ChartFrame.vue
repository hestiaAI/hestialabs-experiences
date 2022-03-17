<template>
  <VCard>
    <VCardTitle class="title ml-3"> {{ title }} </VCardTitle>
    <VCardSubtitle class="subtitle ml-3"> {{ subtitle }} </VCardSubtitle>
    <VCardText><slot></slot></VCardText>
  </VCard>
</template>

<script>
export default {
  name: 'ChartFrame',
  props: {
    title: {
      type: String,
      default: () => ''
    },
    subtitle: {
      type: String,
      default: () => ''
    }
  }
}
</script>
<style scoped>
.title {
  font-size: 1.2rem !important;
  font-weight: 600;
  color: #4d4b4b;
  letter-spacing: 0.1666666667em !important;
  line-height: 2rem;
  text-transform: uppercase;
  font-family: 'Assistant', sans-serif !important;
}
.subtitle {
  font-size: 0.75rem !important;
  font-weight: 300;
  color: #4d4b4b;
  letter-spacing: 0.1666666667em !important;
  line-height: 2rem;
  text-transform: uppercase;
  font-family: 'Assistant', sans-serif !important;
}
</style>
