<template>
  <VRow>
    <VCol
      cols="12"
      align="center"
    >
      <VCard max-width="600px">
        <VCardText>
          <VRow>
            <VCol
              v-for="{ title, value, list } in items"
              :key="title"
              cols="12"
              md="6"
            >
              <div class="overline">
                {{ messages.titles?.[title] }}
              </div>
              <p
                v-if="!value || value.length === 0"
                class="font-weight-bold"
                v-text="messages['Not mentioned']"
              />
              <div v-else-if="list">
                <div class="d-flex flex-column flex-md-row flex-wrap">
                  <VChip
                    v-for="l in value"
                    :key="l"
                    class="ma-2"
                    label
                  >
                    {{ l }}
                  </VChip>
                </div>
              </div>
              <p
                v-else
                class="font-weight-bold"
              >
                {{ messages.values?.[value] || value }}
              </p>
            </VCol>
            <VCol
              v-if="ageFilterMin && ageFilterMax"
              cols="12"
            >
              <div
                class="overline"
                v-text="messages['Age filter']"
              />
              <VRangeSlider
                v-model="slider"
                thumb-color="primary"
                thumb-label="always"
                thumb-size="25"
                color="primary"
                class="pt-10 pr-10 pl-10"
                :min="ageFilterMin - 20"
                :max="ageFilterMax + 20"
                readonly
              />
            </VCol>

            <VCol
              v-if="descriptors.length"
              cols="12"
            >
              <div
                class="overline"
                v-text="messages['Descriptors']"
              />
              <VRow
                v-for="({ name, choices }, idx) in descriptors"
                :key="idx"
              >
                <VCol cols="12">
                  <VCard outlined>
                    <VRow>
                      <VCol cols="4">
                        <VCardTitle>{{ name }}</VCardTitle>
                      </VCol>
                      <VCol cols="8">
                        <VCardText>
                          <div class="d-flex flex-column flex-md-row flex-wrap">
                            <VChip
                              v-for="l in choices"
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
import mixin from './mixin'

function genderIdentity(code) {
  switch (code) {
    case 'F':
      return 'Female'
    case 'M':
      return 'Male'
    default:
      return code
  }
}

function genderInterest(code) {
  switch (code) {
    case 'F':
      return 'Women'
    case 'M':
      return 'Men'
    default:
      return code
  }
}

export default {
  mixins: [mixin],
  data() {
    const [v] = this.values
    const { locale } = this.$i18n
    return {
      slider: [v.ageFilterMin, v.ageFilterMax],
      items: [
        {
          title: 'Birthdate',
          value: this.$d(new Date(v.birthDate), 'dateOnly', locale)
        },
        {
          title: 'Gender',
          value: genderIdentity(v.gender)
        },
        {
          title: 'Education',
          value: v.education
        },
        {
          title: 'College',
          list: true,
          value: JSON.parse(v.college)
        },
        {
          title: 'Interested In',
          value: genderInterest(v.interestedIn)
        },
        {
          title: 'Sexual Orientations',
          list: true,
          value: JSON.parse(v.sexualOrientations)
        },
        {
          title: 'Gender Filter',
          value: genderIdentity(v.genderFilter)
        },
        {
          title: 'Account Creation',
          value: this.$d(new Date(v.createDate), 'long', locale)
        }
      ],
      ...v,
      descriptors: JSON.parse(v.descriptors) || []
    }
  }
}
</script>
