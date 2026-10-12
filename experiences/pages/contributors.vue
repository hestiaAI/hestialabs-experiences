<template>
  <VContainer class="mt-10">
    <h4 class="text-h4">
      {{ $t('Contributors') }}
    </h4>
    <p class="mt-6">
      {{ $t('contributors.intro') }}
    </p>
    <VList three-line>
      <VListItem
        v-for="xp in credited"
        :key="xp.nameAndTag"
        nuxt
        :to="localePath({ name: 'experience-experience', params: { experience: xp.slug } })"
      >
        <VListItemAvatar tile>
          <VImg :src="xp.icon" :lazy-src="xp.icon" contain />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle class="font-weight-bold">
            {{ xp.title }}
          </VListItemTitle>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="body-2 mt-1" v-html="xp.credits" />
        </VListItemContent>
      </VListItem>
    </VList>
  </VContainer>
</template>

<script>
import { mapGetters } from 'vuex'
import mixinPage from '@/mixins/page'

export default {
  mixins: [mixinPage],
  head() {
    return this.vueMeta(this.$t('Contributors'))
  },
  computed: {
    ...mapGetters(['experiencesEnabled']),
    credited() {
      const { locale } = this.$i18n
      return this.experiencesEnabled
        .map(xp => ({
          ...xp,
          title: xp.messages?.[locale]?.intro?.title || xp.title,
          credits: xp.messages?.[locale]?.intro?.credits || xp.credits
        }))
        .filter(xp => xp.credits)
    }
  }
}
</script>
