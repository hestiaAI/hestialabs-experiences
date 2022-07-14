<template>
  <a
    :href="collaborator.url"
    target="_blank"
    rel="noreferrer noopener"
  >
    <VImg
      :src="collaborator.icon"
      :lazy-src="collaborator.icon"
      :alt="collaborator.title"
      contain
      :width="width"
    />
  </a>
</template>

<script>
export default {
  props: {
    collaborator: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 100
    }
  }
}
</script>
