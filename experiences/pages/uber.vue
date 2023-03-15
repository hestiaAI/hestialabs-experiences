<template>
  <div>
    <div class="banner-wrapper">
      <VContainer>
        <div class="text-center">
          <h1 class="banner-title font-weight-bold white--text text-uppercase text-break">
            Chauffeurs Uber
          </h1>
          <h6 class="text-h6 white--text">
            Analysez ici votre activité Uber grâce à vos données.
          </h6>
        </div>
      </VContainer>
    </div>
    <VContainer>
      <section ref="get-your-data" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Choississez votre pays:
            </div>
            <p class="text-h6">
              <ul>
                <li>
                  <NuxtLink to="/france/uber">
                    France
                  </NuxtLink>
                </li>
              </ul>
            </p>
          </VCol>
        </VRow>
      </section>
    </VContainer>
  </div>
</template>

<script>
import mixinPage from '@/mixins/page'

export default {
  mixins: [mixinPage],
  head() {
    return this.vueMeta('Uber')
  }
}

</script>
<style scoped>
.banner-wrapper {
  background: var(--v-primary-base);
  padding: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
}
.banner-title {
  font-size: 4.5vw;
  display: inline-block;
  line-height:1.1em;
  margin: 20px 0;
}
.section-wrapper {
  margin-top: 60px;
  margin-bottom: 40px;
}
</style>
