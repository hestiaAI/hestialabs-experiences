<template>
  <div>
    <div class="banner-wrapper">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" md="6">
            <h1 class="banner-title font-weight-bold white--text">
              <div>DIGIPOWER</div>
              <div class="ml-13">
                .ACADEMY
              </div>
            </h1>
            <h4 class="banner-subtitle white--text font-weight-regular" />
          </VCol>
          <VCol cols="12" md="6">
            <BaseQuote
              text="We need to train both the people who are putting data and information out there, as well as those reading it, how to interpret and question it to ensure they understand it and are not being misled or deceived."
              author="Sir Tim Berners-Lee, inventor of the World Wide Web"
            />
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper pa-15">
      <VContainer>
        <VRow justify="center">
          <VCol v-for="tool in tools" :key="tool.title" cols="12" md="4">
            <BaseInfoCard
              v-bind="{...tool}"
            />
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper pa-15 light-background">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h3 class="section-title font-weight-medium">
                Learning programs
              </h3>
              <p>Choose the course(s) of your choice or assemble them to create curricula relevant to your needs.</p>
            </div>
          </VCol>
        </VRow>
        <VRow justify="center">
          <template v-if="$store.state.config.bubbleConfig">
            <VCol
              v-for="({ title, icon, description, slug}) in workshops"
              :key="slug"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="text-center"
            >
              <BaseBubbleCard
                v-bind="{title, description, icon, slug}"
                class="pa-3"
              />
            </VCol>
          </template>
          <template v-else>
            <span class="caption">No workshops available right now, please contact us for more informations.</span>
          </template>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper pa-15">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h3 class="section-title font-weight-medium">
                Testimonial
              </h3>
              <p>See what our customers say</p>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <div class="text-center">
              <VCarousel
                height="400"
                hide-delimiter-background
                show-arrows-on-hover
                delimiter-icon="$vuetify.icons.mdiMinus"
                light
              >
                <VCarouselItem>
                  <VRow align="center" justify="center">
                    <BaseTwitterCard
                      text="To hope to effectively regulate the data economy you need to deeply understand the power companies have through the personal data they hold. That's why I am participating in @sitrafund's #digipower investigation using #GDPR rights to get my data. Who will be the most transparent?"
                      tweet-link="https://twitter.com/jyrkikatainen/status/1455484493897342977?s=20&t=YdTsvxYhUonm0Gxr9nICvw"
                      profile-name="Jyrki Katainen"
                      profile-description="Former Prime Minister of Finland and VP of EU Commission"
                      profile-photo="https://pbs.twimg.com/profile_images/1229410125930270720/MLN38R_9_400x400.jpg"
                    />
                  </VRow>
                </VCarouselItem>
                <VCarouselItem>
                  <VRow align="center" justify="center">
                    <BaseVideo video-src="https://player.vimeo.com/video/689283925?h=4b12093bf4" height="360" />
                  </VRow>
                </VCarouselItem>
              </VCarousel>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>
  </div>
</template>
<script>
import { pick } from 'lodash-es'
import BaseBubbleCard from '../components/base/card/BaseBubbleCard.vue'
import BaseTwitterCard from '@/components/base/card/BaseTwitterCard.vue'

export default {
  components: { BaseBubbleCard, BaseTwitterCard },
  data() {
    return {
      tools: [
        {
          title: 'What we do',
          text: 'Digipower.academy empower people and organisations through the mastery of data and data flows.',
          icon: 'mdiDatabaseCog'
        },
        {
          title: 'Who is it for',
          text: 'Business leaders, civil servants, researchers, journalists, teachers, you will find here the resources towards understanding and using data in your field.',
          icon: 'mdiAccountGroup'
        },
        {
          title: 'Why is it so special',
          text: 'The sessions take place in the digital life of the participants themselves. They retrieve, explore and make sense of their own data. Highly impactful.',
          icon: 'mdiWeb'
        }
      ]
    }
  },
  computed: {
    workshops() {
      return Object.entries(this.$store.state.config.bubbleConfig).map(([slug, conf]) => {
        const config = pick(conf, [
          'title',
          'icon',
          'description',
          'publicKey'
        ])
        return { slug, ...config }
      }).filter(w => !w.publicKey)
    }
  }
}
</script>

<style scoped>
.banner-wrapper {
  background: var(--v-primary-base);
  padding: 20px;
  min-height: 400px;
  display: flex;
  align-items: center;
}
.banner-title {
  font-size: 60px;
  line-height: 50px;
  margin: 20px 0;
}
.banner-subtitle {
  font-size: 20px;
}

.section-title {
  font-size: 25px;
  margin: 20px;
  line-height: 30px;
  color: #464e61;
}

.pa-15 {
  padding: 50px;
}

.light-background{
  background-color: #f2f2f2
}

.icon-wrapper {
  background-color: #9ca299;
  border-radius: 100%;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  display: inline-block;
  margin: 20px 0 30px;
}
.icon {
  font-size: 50px;
  color: white;
  vertical-align:middle;
}
</style>
