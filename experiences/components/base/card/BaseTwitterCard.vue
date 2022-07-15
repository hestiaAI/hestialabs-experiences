<template>
  <VCard
    class="mx-auto"
    color="primary"
    dark
    max-width="400"
    :href="tweetLink"
    hover
  >
    <VCardTitle>
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
            :src="profilePhoto"
          />
        </VListItemAvatar>

        <VListItemContent>
          <VListItemTitle class="font-weight-bold">
            {{ profileName }}
          </VListItemTitle>
          <div>{{ profileDescription }}</div>
        </VListItemContent>
      </VListItem>
    </VCardActions>
  </VCard>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    profileName: {
      type: String,
      default: ''
    },
    profileDescription: {
      type: String,
      default: ''
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    tweetLink: {
      type: String,
      default: ''
    }
  }
}
</script>
