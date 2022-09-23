<template>
  <VRow>
    <VCol cols="12" align="center">
      <VCard max-width="600px">
        <VCardText>
          <VRow>
            <VCol v-for="item in items" :key="item.title" cols="12" md="6">
              <div class="overline">
                {{ item.title }}
              </div>
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
    const [v] = this.values
    const birthDate = new Date(v.birthday)
    const lastOnline = new Date(v.lastOnlineUtc)
    return {
      slider: [v.ageFilterMin, v.ageFilterMax],
      items: [
        {
          title: 'Name',
          value: v.name
        },
        {
          title: 'FullName',
          value: v.fullName
        },
        {
          title: 'Birthdate',
          value: !isNaN(birthDate.getTime())
            ? d3.timeFormat('%B %d, %Y')(birthDate)
            : ''
        },
        {
          title: 'Last Online',
          value: !isNaN(lastOnline.getTime())
            ? d3.timeFormat('%B %d, %Y at %H:%M:%S')(lastOnline)
            : ''
        },
        {
          title: 'Email',
          value: v.email
        },
        {
          title: 'Height (cm)',
          value: v.heightInCm
        },
        {
          title: 'Location',
          value: v.location
        },
        {
          title: 'Custom Location',
          value: v.customLocation
        },
        {
          title: 'Account Status',
          value: v.status
        },
        {
          title: 'Account creation',
          value: d3.timeFormat('%B %d, %Y at %H:%M:%S')(
            new Date(v.registrationDateUtc)
          )
        },
        {
          title: 'Notifications Enabled',
          value: v.pushNotificationsEnabled
        },
        {
          title: 'Last used filters',
          value: v.lastUsedFilters.split(','),
          list: true
        }
      ],
      ...v
    }
  }
}
</script>
