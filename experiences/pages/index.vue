<template>
  <div>
    <div class="banner-wrapper">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" md="6">
            <h1 class="banner-title font-weight-bold white--text">
              Understand, lever and build stuff with data
            </h1>
            <h4 class="banner-subtitle white--text font-weight-regular">
              We are Digipower.academy, we empower people and organisations through the mastery of data flows
            </h4>
          </VCol>
          <VCol cols="12" md="6" />
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
                Our current workshops
              </h3>
              <p>Choose the workshop(s) of your choice</p>
            </div>
          </VCol>
        </VRow>
        <VRow justify="center">
          <template v-if="$store.state.config.bubbleConfig">
            <VCol
              v-for="({ title, icon }, slug) in $store.state.config.bubbleConfig"
              :key="slug"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="text-center"
            >
              <BaseBubbleCard
                v-bind="{title, icon, slug}"
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
              <span class="caption">No testimonial yet.</span>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper pa-15">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="9">
            <h3 class="section-title font-weight-medium ml-0">
              Any question?
            </h3>
            <BaseContactForm />
          </VCol>
        </VRow>
      </VContainer>
    </div>
  </div>
</template>
<script>
import BaseBubbleCard from '../components/base/card/BaseBubbleCard.vue'
export default {
  components: { BaseBubbleCard },
  data() {
    return {
      tools: [
        {
          title: 'Subject Access Request',
          text: 'As an app user you have “data subject rights”. The app does not own your data, you do. You can recover your data in a file via a Subject Access Request (SAR).',
          icon: 'mdiTextBoxEditOutline',
          actionText: 'See more',
          actionHref: 'https://hestialabs.org/en/act/sar/'
        },
        {
          title: 'Experiences',
          text: 'The private data that companies have collected about you is often in a format that is difficult to understand. Once you receive it, you can easily analyse it using our visualisation tools.',
          icon: 'mdiChartBar',
          actionText: 'See more',
          actionHref: '/experience'
        },
        {
          title: 'Workshops',
          text: 'Want to go deeper? Participate to one of our workshops, mutualise and take back control of your data.',
          icon: 'mdiAccountGroup',
          actionText: 'Contact us',
          actionHref: 'https://hestia.ai/en/#contact'
        }
      ]
    }
  }
}
</script>

<style scoped>
.banner-wrapper {
    background: #5A53A0;
    padding: 20px;
    min-height: 400px;
    display: flex;
    align-items: center;
}
.banner-title {
    font-size: 40px;
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
