<template>
  <VCard class="mx-auto" color="#26c6da" dark max-width="400">
    <VCardTitle>
      <VIcon large left> mdi-twitter </VIcon>
      <span class="text-h6 font-weight-light">Twitter</span>
    </VCardTitle>

    <VCardText class="text-h5 font-weight-bold">
      "Turns out semicolon-less style is easier and safer in TS because most
      gotcha edge cases are type invalid as well."
    </VCardText>

    <VCardActions>
      <VListItem class="grow">
        <VListItemAvatar color="grey darken-3">
          <VImg
            class="elevation-6"
            alt=""
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></VImg>
        </VListItemAvatar>

        <VListItemContent>
          <VListItemTitle>Evan You</VListItemTitle>
        </VListItemContent>

        <VRow align="center" justify="end">
          <VIcon class="mr-1"> mdi-heart </VIcon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <VIcon class="mr-1"> mdi-share-variant </VIcon>
          <span class="subheading">45</span>
        </VRow>
      </VListItem>
    </VCardActions>
  </VCard>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    getIcon(iconName) {
      return this.$vuetify.icons.values[iconName]
    }
  }
}
</script>
