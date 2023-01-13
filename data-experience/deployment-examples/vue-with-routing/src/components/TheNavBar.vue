<template>
  <div class="d-flex justify-center">
    <VSlideGroup
      v-model="model"
      show-arrows
      center-active
      tag="nav"
      class="pa-4"
    >
      <VSlideItem
        v-for="{ title, icon, slug } in experiences"
        :key="slug"
        :value="slug"
        v-slot="{ active, toggle }"
      >
        <VCard
          :dark="active"
          height="200"
          width="200"
          :class="['ma-4', active ? 'teal darken-2' : '']"
          @click="onClick(slug, toggle)"
        >
          <VRow
            class="fill-height flex-column flex-nowrap align-center justify-center"
          >
            <VImg
              :src="icon"
              :lazy-src="icon"
              max-height="100"
              max-width="100"
            />
            <span class="text-subtitle mt-3">{{ title }}</span>
          </VRow>
        </VCard>
      </VSlideItem>
    </VSlideGroup>
  </div>
</template>

<script>
import experiences from '@/experiences'

export default {
  name: 'TheNavBar',
  data() {
    return {
      model: this.$route.params.experience,
      experiences
    }
  },
  watch: {
    '$route.params.experience'(value) {
      this.model = value
    }
  },
  methods: {
    onClick(experienceParam, toggleFunc) {
      if (experienceParam === this.$route.params.experience) {
        toggleFunc()
        this.$router.push({ name: 'home' })
      } else {
        this.$router.push(`/${experienceParam}`)
      }
    }
  }
}
</script>
