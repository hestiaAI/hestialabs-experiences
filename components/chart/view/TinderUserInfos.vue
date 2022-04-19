<template>
  <VRow>
    <VCol cols="12" align="center">
      <VCard max-width="600px">
        <VCardText>
          <VRow>
            <VCol v-for="item in items" :key="item.title" cols="12" md="6">
              <div class="overline">{{ item.title }}</div>
              <p
                v-if="!item.value || item.value.length === 0"
                class="font-weight-bold"
              >
                Not mentioned
              </p>
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
            <VCol
              v-if="values[0].ageFilterMin && values[0].ageFilterMax"
              cols="12"
            >
              <div class="overline">Age filter</div>
              <VRangeSlider
                v-model="slider"
                thumb-color="primary"
                thumb-label="always"
                thumb-size="25"
                color="primary"
                class="pt-10 pr-10 pl-10"
                :min="values[0].ageFilterMin - 20"
                :max="values[0].ageFilterMax + 20"
                readonly
              ></VRangeSlider>
            </VCol>

            <VCol v-if="descriptors.length" cols="12">
              <div class="overline">Descriptors</div>
              <VRow v-for="(descriptor, idx) in descriptors" :key="idx">
                <VCol cols="12">
                  <VCard outlined>
                    <VRow>
                      <VCol cols="4">
                        <VCardTitle>{{ descriptor.name }}</VCardTitle>
                      </VCol>
                      <VCol cols="8">
                        <VCardText>
                          <div class="d-flex flex-column flex-md-row flex-wrap">
                            <VChip
                              v-for="l in descriptor.choices"
                              :key="l"
                              class="ma-2"
                              label
                            >
                              {{ l }}
                            </VChip>
                          </div>
                        </VCardText>
                      </VCol>
                    </VRow>
                  </VCard>
                </VCol>
              </VRow>
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
      slider: [this.values[0].ageFilterMin, this.values[0].ageFilterMax]
    }
  },
  computed: {
    items() {
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
          list: true,
          value: JSON.parse(this.values[0].college)
        },
        {
          title: 'Interested In',
          value: this.values[0].interestedIn
        },
        {
          title: 'Sexual Orientations',
          list: true,
          value: JSON.parse(this.values[0].sexualOrientations)
        },
        {
          title: 'Gender filter',
          value: this.values[0].genderFilter
        },
        {
          title: 'Account creation',
          value: d3.timeFormat('%B %d, %Y at %H:%M:%S')(
            new Date(this.values[0].createDate)
          )
        }
      ]
    },
    descriptors() {
      return JSON.parse(this.values[0].descriptors) || []
    }
  },
  methods: {
    drawViz() {}
  }
}
</script>
<style scoped></style>
