<template>
  <ExternalLink
    :href="collaborator.url"
  >
    <VImg
      :src="collaborator.icon"
      :lazy-src="collaborator.icon"
      :alt="collaborator.title"
      contain
      :width="width"
    />
  </ExternalLink>
</template>

<script>
export default {
  name: 'CollaboratorLink',
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
