<template>
  <VRow>
    <VCol cols="12" align="center">
      <VCard max-width="600px">
        <VCardTitle class="mt-8">
          <VAvatar size="56">
            <VIcon> $vuetify.icon.mdiAccount </VIcon>
          </VAvatar>
          <div class="ml-3">{{ values[0].fullName }}</div>
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VList subheader three-line>
                <VSubheader>User infos</VSubheader>

                <VListItem v-for="item in usersInfos" :key="item.title">
                  <VListItemContent>
                    <VListItemTitle class="overline">{{
                      item.title
                    }}</VListItemTitle>
                    <VListItemSubtitle class="font-weight-bold">
                      {{ item.value }}
                    </VListItemSubtitle>
                  </VListItemContent>
                </VListItem>
              </VList>
            </VCol>
            <VDivider vertical></VDivider>
            <VCol cols="12" md="6">
              <VList subheader three-line>
                <VSubheader>Application settings</VSubheader>

                <VListItem v-for="item in appSettings" :key="item.title">
                  <VListItemContent>
                    <VListItemTitle class="overline">{{
                      item.title
                    }}</VListItemTitle>
                    <VListItemSubtitle
                      v-if="!item.slider"
                      class="font-weight-bold"
                    >
                      {{ item.value }}
                    </VListItemSubtitle>
                    <VListItemSubtitle v-else>
                      <VRangeSlider
                        v-model="item.value"
                        thumb-color="primary"
                        thumb-label="always"
                        thumb-size="25"
                        color="primary"
                        class="pt-10 pr-10 pl-10"
                        :min="item.value[0] - 20"
                        :max="item.value[1] + 20"
                        readonly
                      ></VRangeSlider>
                    </VListItemSubtitle>
                  </VListItemContent>
                </VListItem>
              </VList>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import * as d3 from 'd3'
import mixin from './mixin'
export default {
  mixins: [mixin],
  data() {
    return {
      ageExtent: [20, 40]
    }
  },
  computed: {
    usersInfos() {
      return [
        {
          title: 'Birthdate',
          value: d3.timeFormat('%B %d, %Y')(new Date(this.values[0].birthDate))
        },
        {
          title: 'Gender',
          value: this.values[0].gender
        },
        {
          title: 'Education',
          value: this.values[0].education
        },
        {
          title: 'College',
          value: this.values[0].college
        },
        {
          title: 'Description',
          value: this.values[0].description
        }
      ]
    },
    appSettings() {
      return [
        {
          title: 'Gender filter',
          value: this.values[0].genderFilter
        },
        {
          title: 'Interested In',
          value: this.values[0].interestedIn
        },
        {
          title: 'Age filter',
          slider: true,
          value: [this.values[0].ageFilterMin, this.values[0].ageFilterMax]
        },
        {
          title: 'Account creation',
          value: d3.timeFormat('%B %d, %Y at %H:%M:%S')(
            new Date(this.values[0].createDate)
          )
        }
      ]
    }
  },
  methods: {
    drawViz() {}
  }
}
</script>
<style scoped></style>
