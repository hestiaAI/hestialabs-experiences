<template>
  <VCard
    class="mx-auto ma-3"
    color="primary"
    dark
    max-width="400"
    :href="link"
    hover
  >
    <VCardTitle v-if="twitter">
      <VIcon
        large
        left
      >
        $vuetify.icons.mdiTwitter
      </VIcon>
      <span class="text-h6 font-weight-light">Twitter</span>
    </VCardTitle>

    <VCardText class="text-subtitle-1 font-weight-bold pr-5 pl-5">
      "{{ text }}"
    </VCardText>

    <VCardActions>
      <VListItem class="grow">
        <VListItemAvatar color="grey darken-3">
          <VImg
            class="elevation-6"
            alt=""
            :src="photo"
          />
        </VListItemAvatar>

        <VListItemContent>
          <VListItemTitle class="font-weight-bold">
            {{ name }}
          </VListItemTitle>
          <div>{{ description }}</div>
        </VListItemContent>
      </VListItem>
    </VCardActions>
  </VCard>
</template>
<script>
export default {
  name: 'BaseTwitterCard',
  props: {
    text: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    twitter: {
      type: Boolean,
      default: false
    }
  }
}
</script>
