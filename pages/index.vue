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
    <div class="section-wrapper spacer">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h3 class="section-title font-weight-medium">
                Our tools
              </h3>
            </div>
          </VCol>
        </VRow>
        <VRow justify="center">
          <VCol cols="12" md="4">
            <VCard flat>
              <VCardText>
                <div class="icon light-background">
                  <VIcon large>
                    $vuetify.icons.mdiAccount
                  </VIcon>
                </div>
                <h4 class="font-weight-medium">
                  Experiences
                </h4>
                <p class="mt-3 mb-3">
                  Lorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsum
                </p>
                <div>
                  <VBtn
                    text
                    color="primary"
                  >
                    See more
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" md="4">
            <VCardText>
              <div class="icon light-background">
                <VIcon large>
                  $vuetify.icons.mdiAccount
                </VIcon>
              </div>
              <h4 class="font-weight-medium">
                SARs
              </h4>
              <p class="mt-3 mb-3">
                Lorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsum
              </p>
              <div>
                <VBtn
                  text
                  color="primary"
                >
                  See more
                </VBtn>
              </div>
            </VCardText>
          </VCol>
          <VCol cols="12" md="4">
            <VCardText>
              <div class="icon light-background">
                <VIcon large>
                  $vuetify.icons.mdiAccount
                </VIcon>
              </div>
              <h4 class="font-weight-medium">
                Workshops
              </h4>
              <p class="mt-3 mb-3">
                Lorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsumLorem Ipusum ipsum
              </p>
              <div>
                <VBtn
                  text
                  color="primary"
                >
                  See more
                </VBtn>
              </div>
            </VCardText>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper spacer light-background">
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
      </VContainer>
    </div>
    <div class="section-wrapper spacer">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="9" lg="7">
            <div class="text-center">
              <h3 class="section-title font-weight-medium">
                Testimonial
              </h3>
              <p>Choose the workshop(s) of your choice</p>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div class="section-wrapper spacer">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" sm="10" md="10" lg="8">
            <h3 class="section-title font-weight-medium">
              Any question?
            </h3>
            <form>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Name"
                    outlined
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Email"
                    outlined
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    outlined
                    name="input-7-4"
                    label="Message"
                  />
                </VCol>
              </VRow>
            </form>
          </VCol>
          <VCol cols="12" sm="10" md="10" lg="8" />
        </VRow>
      </VContainer>
    </div>
  </div>
</template>
<style scoped>
.banner-wrapper {
    background: #5A53A0;
    padding: 20px 0;
    min-height: 350px;
    display: flex;
    align-items: center;
}
.banner-title {
    font-size: 42px;
    line-height: 54px;
    margin: 20px 0 15px;
}
.banner-subtitle {
  font-size: 21px;
}

.section-title {
  font-size: 28px;
  margin: 20px 0 20px;
  line-height: 30px;
  color: #464e61;
}

.spacer {
  padding: 60px;
}

.light-background{
  background-color: #f2f2f2
}

.icon {
    font-size: 45px;
    width: 80px;
    color: #607df9;
    line-height: 80px;
    text-align: center;
    display: inline-block;
    margin: 20px 0 30px;
    border-radius: 100%;
}
</style>
