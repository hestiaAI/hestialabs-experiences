<template>
  <div>
    <div class="banner-wrapper">
      <VContainer>
        <div class="text-center">
          <h1 class="banner-title font-weight-bold white--text text-uppercase text-break">
            Analyze Your Data
          </h1>
        </div>
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
                Demos
              </h3>
              <p>Watch our live demonstrations</p>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="6">
            <VCard height="400" flat>
              <VCardTitle>Join the next demos</VCardTitle>
              <VList three-line class="pa-6">
                <template v-for="(event, index) in events">
                  <VDivider
                    v-if="index"
                    :key="index"
                    :inset="true"
                  />
                  <VListItem
                    :key="event.title"
                  >
                    <div class="text-center">
                      <div>{{ event.month }}</div>
                      <div class="text-h6">
                        {{ event.day }}
                      </div>
                    </div>
                    <div class="ml-6">
                      <div class="text-caption">
                        {{ event.time }}
                      </div>
                      <div> {{ event.title }}</div>
                    </div>
                  </VListItem>
                </template>
              </VList>
            </VCard>
          </VCol>
          <VCol cols="12" md="6" class="">
            <VCard height="400" flat color="transparent">
              <VCardTitle class="justify-center">
                Replay the last Demos
              </VCardTitle>
              <VCarousel
                height="340"
                hide-delimiter-background
                show-arrows-on-hover
                delimiter-icon="$vuetify.icons.mdiMinus"
                light
              >
                <VCarouselItem v-for="(url, index) in videos" :key="index">
                  <VRow align="center" justify="center">
                    <iframe
                      :src="url"
                      frameborder="0"
                      scrolling="no"
                      allowfullscreen="true"
                      height="300"
                      width="70%"
                      class=""
                    />
                  </VRow>
                </VCarouselItem>
              </VCarousel>
            </VCard>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper pa-15">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h3 class="section-title font-weight-medium">
                Showroom
              </h3>
              <p>Try out some of our experiences for free</p>
            </div>
          </VCol>
        </VRow>
        <VRow justify="center">
          <TheExperienceMenuCards :experiences="experiences" class="pa-3" />
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
          <template v-if="workshops.length">
            <VCol
              v-for="(workshop, index) in workshops"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="text-center"
            >
              <BaseBubbleCard
                v-bind="workshop"
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
                height="480"
                hide-delimiter-background
                show-arrows-on-hover
                delimiter-icon="$vuetify.icons.mdiMinus"
                light
              >
                <VCarouselItem v-for="(testimonial, index) in testimonials" :key="index">
                  <VRow align="center" justify="center" class="fill-height">
                    <BaseQuoteCard
                      v-bind="{...testimonial}"
                    />
                  </VRow>
                </VCarouselItem>
                <VCarouselItem>
                  <VRow align="center" justify="center" class="fill-height">
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

export default {
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
      ],
      events: [
        {
          month: 'Nov',
          day: '17',
          time: '9 pm CET',
          theme: 'Linkedin',
          title: 'Identify your company\'s strengths and weaknesses and create engagement through employee Linkedin data.',
          language: 'FR'
        },
        {
          month: 'Nov',
          day: '24',
          time: '9 pm CET',
          theme: 'Tracking trackers (ios + Android) + App Audit - Use case: EdTech solutions (Moodle, Blackboard, Canva ?)',
          title: 'Improve transparency and build trust with audits of your sites and apps.',
          language: 'EN'
        },
        {
          month: 'Dec',
          day: '1',
          time: '9 pm CET',
          theme: 'Tinder + Her + Twitter including aggregation as an example of Digipower tools used for teaching & reseearch',
          title: 'Data analysis as a teaching and research tool (featuring Sciences Po professors)',
          language: 'EN'
        }
      ],
      videos: [
        'https://player.twitch.tv/?video=1648947472&parent=localhost&parent=digipower.academy&autoplay=false',
        'https://player.twitch.tv/?video=1648959623&parent=digipower.academy&parent=localhost&autoplay=false',
        'https://player.twitch.tv/?video=1648971525&parent=digipower.academy&parent=localhost&autoplay=false'
      ],
      testimonials: [
        {
          text: "Les géants du web ont fait de nous des datas, mais ça n'est pas une fatalité. Aujourd'hui il est temps de renverser la tendance, de réagir en reprenant la main sur nos données personelles. Nous avons des droits, exerçons-les!",
          link: 'https://twitter.com/jyrkikatainen/status/1455484493897342977?s=20&t=YdTsvxYhUonm0Gxr9nICvw',
          name: 'Alain Bazot',
          description: 'Président de l\'UFC- QUE CHOISIR',
          photo: 'https://pbs.twimg.com/profile_images/914770787764260865/PioYDllJ_400x400.jpg',
          twitter: false
        },
        {
          text: "To hope to effectively regulate the data economy you need to deeply understand the power companies have through the personal data they hold. That's why I am participating in @sitrafund's #digipower investigation using #GDPR rights to get my data. Who will be the most transparent?",
          link: 'https://twitter.com/jyrkikatainen/status/1455484493897342977?s=20&t=YdTsvxYhUonm0Gxr9nICvw',
          name: 'Jyrki Katainen',
          description: 'Former Prime Minister of Finland and VP of EU Commission',
          photo: 'https://pbs.twimg.com/profile_images/1229410125930270720/MLN38R_9_400x400.jpg',
          twitter: true
        },
        {
          text: "You should do it! You can download your data, it doesn't take very long. I'm not a technical person, I'm not a computer scientist and this experience was enlightening. If you can do it, I would recommend it.",
          link: 'https://youtu.be/CkxtsAYIZtM?t=3061',
          name: 'Mark Scott',
          description: 'Chief Technology Correspondent at POLITICO',
          photo: 'https://www.politico.eu/cdn-cgi/image/width=480,quality=80,onerror=redirect,format=auto/wp-content/uploads/2017/07/MarkScott.jpeg',
          twitter: false
        },
        {
          text: 'What surprised me most was the data collected by Uber. Uber had information that even my colleagues didn’t have – they know the location of my office and where my friends live. Some websites, such as the newspaper Le Monde did the same. They rely on people not asking for their data.',
          link: 'https://twitter.com/SitraFund/status/1529092653459116033?s=20&t=AOR5HO2lXcgooLfnb00WSA',
          name: 'Leïla Chaibi',
          description: 'Member of the European Parliament',
          photo: 'https://pbs.twimg.com/profile_images/1562443761849749504/KcfCN2NG_400x400.jpg',
          twitter: false
        },
        {
          text: 'Nous étions les premiers à comprendre les enjeux sur la question des données (#data). @podehaye était la pour accompagner notre démarche avec les outils nécessaires qui nous ont permis à la fin de saisir @CNIL. Merci à Paul 🙏',
          link: 'https://twitter.com/BENALIBrahim20/status/1576878448890761216?s=20&t=3Wzb0JsvUHgWAp2RVfB_rg',
          name: 'Brahim Ben Ali',
          description: 'General Secretary of the VTC drivers\' union INV',
          photo: 'https://pbs.twimg.com/profile_images/1284456830987632641/wejXQQi9_400x400.jpg',
          twitter: true
        },
        {
          text: 'That was really exciting! You are doing an outstanding job in an area that is still to be explored. Thank you.',
          name: 'Giuseppe Luciano',
          description: 'Chief Customer Officer at TL',
          photo: 'data:image/jpeg;base64,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',
          twitter: false
        },
        {
          text: 'Je voulais comprendre le fonctionnement des plateformes numériques et savoir comment les réseaux sociaux faisaient pour avoir accès à mes données.',
          name: 'Christian Dandrès',
          description: 'Conseiller national, PS, Genève',
          link: 'https://www.heidi.news/explorations/surveillance-numerique-jusqu-ou-sommes-nous-traques/comment-les-elus-a-berne-sont-influences-jusque-sur-twitter',
          photo: 'https://pbs.twimg.com/profile_images/1504044101796306956/DRXGLIcJ_400x400.jpg',
          twitter: false
        }
      ]
    }
  },
  computed: {
    workshops() {
      const bubbleConfig = this.$store.state.config.bubbleConfig || {}
      return Object.entries(bubbleConfig).map(([slug, conf]) => {
        const config = pick(conf, [
          'title',
          'icon',
          'description'
        ])
        return { slug, ...config }
      }).filter(w => (this.$store.state.config.homePageBubbles || []).includes(w.slug))
    },
    experiences() {
      return ['twitter', 'facebook', 'google', 'tracker-control']
        .map(e => this.$store.state.experiences[e].config)
        .filter(e => e)
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
  font-size: 6.5vw;
  display: inline-block;
  line-height:1.1em;
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
