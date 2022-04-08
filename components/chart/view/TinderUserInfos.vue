<template>
  <VRow>
    <VCol cols="12" align="center">
      <VCard max-width="600px">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <span class="text-subtitle-1">User infos</span>
            </VCol>
            <VCol v-for="item in usersInfos" :key="item.title" cols="12" md="6">
              <div class="overline">{{ item.title }}</div>
              <div v-if="item.list">
                <div class="d-flex flex-column flex-md-row flex-wrap">
                  <VChip v-for="l in item.value" :key="l" class="ma-2" label>
                    {{ l }}
                  </VChip>
                </div>
              </div>
              <p v-else class="font-weight-bold">
                {{ item.value }}
              </p>
            </VCol>
          </VRow>
          <VDivider class="mt-4 mb-4"></VDivider>
          <VRow class="">
            <VCol cols="12">
              <span class="text-subtitle-1">Application settings</span>
            </VCol>
            <VCol
              v-for="item in appSettings"
              :key="item.title"
              cols="12"
              md="6"
            >
              <div class="overline">{{ item.title }}</div>
              <div v-if="item.slider">
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
              </div>
              <div v-else-if="item.list">
                <div class="d-flex flex-column flex-md-row flex-wrap">
                  <VChip v-for="l in item.value" :key="l" class="ma-2" label>
                    {{ l }}
                  </VChip>
                </div>
              </div>
              <p v-else class="font-weight-bold">
                {{ item.value }}
              </p>
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
          title: 'Interested In',
          value: this.values[0].interestedIn
        },
        {
          title: 'Sexual Orientations',
          list: true,
          value: this.values[0].sexualOrientations.split(',')
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
          title: 'Account creation',
          value: d3.timeFormat('%B %d, %Y at %H:%M:%S')(
            new Date(this.values[0].createDate)
          )
        },
        {
          title: 'Age filter',
          slider: true,
          value: [this.values[0].ageFilterMin, this.values[0].ageFilterMax]
        },
        {
          title: 'Descriptors',
          list: true,
          value: JSON.parse(this.values[0].descriptors).map(v => v.name)
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
