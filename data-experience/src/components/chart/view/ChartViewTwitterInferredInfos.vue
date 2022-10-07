<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="6">
        <h3 v-text="messages.itemsTitle" />
        <VList>
          <VListItem v-for="{ id, value } in items" :key="id">
            <VListItemContent>
              <div class="d-flex justify-space-between">
                <span v-text="messages.items[id].title" />
                <div
                  v-if="Array.isArray(value)"
                  class="d-flex flex-column flex-md-row flex-wrap"
                >
                  <VChip v-for="l in value" :key="l" class="ma-2" label>
                    {{ l }}
                  </VChip>
                </div>
                <span v-else v-text="value" />
              </div>
            </VListItemContent>
            <VListItemIcon>
              <!-- v-model="item.show" -->
              <VTooltip
                v-if="messages.items[id].hint"
                left
                max-width="200"
              >
                <template #activator="{ on, attrs }">
                  <VHover>
                    <VIcon color="" v-bind="attrs" v-on="on">
                      $vuetify.icons.mdiInformationOutline
                    </VIcon>
                  </VHover>
                </template>
                <span v-text="messages.items[id].hint" />
              </VTooltip>
            </VListItemIcon>
          </VListItem>
        </VList>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <h3 v-text="messages.tablesTitle" />
      </VCol>
    </VRow>
    <VRow>
      <VCol
        v-for="{ id, headers, values } in tables"
        :key="id"
        cols="12"
        md="6"
        align="center"
      >
        <VCard max-width="" height="100%">
          <VCardTitle>
            {{ messages.tables[id].title }}
            <VSpacer />
            <!-- v-model="table.show" -->
            <VTooltip
              v-if="messages.tables[id].hint"
              left
              max-width="200"
            >
              <template #activator="{ on, attrs }">
                <VIcon color="" v-bind="attrs" v-on="on">
                  $vuetify.icons.mdiInformationOutline
                </VIcon>
              </template>
              <span v-text="messages.tables[id].hint" />
            </VTooltip>
          </VCardTitle>
          <VCardText>
            <UnitFilterableTable
              :id="id"
              v-bind="{ headers, items: values }"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  data() {
    const [firstItem] = this.values
    const v = Object.fromEntries(Object.entries(firstItem).map(([k, v]) => {
      try {
        return [k, JSON.parse(v)]
      } catch {
        return [k, v]
      }
    }))
    const items = [
      {
        id: 'gender',
        value: v.gender
      },
      {
        id: 'age',
        value: v.age
      },
      {
        id: 'languages',
        value: v.languages.map(l => l.language)
      },
      {
        id: 'numAudiences',
        value: v.numAudiences
      }
    ]
    const tables = [
      {
        id: 'interests',
        headers: [{ text: 'Inferred Interests', value: 'v' }],
        values: v.interests.map(v => ({ v: v.name }))
      },
      {
        id: 'lookalikeAdvertisers',
        headers: [
          { text: 'Look-alike Advertisers', value: 'v' }
        ],
        values: v.lookalikeAdvertisers.map(v => ({ v }))
      },
      {
        id: 'advertisers',
        headers: [{ text: 'Advertisers', value: 'v' }],
        values: v.advertisers.map(v => ({ v }))
      },
      {
        id: 'shows',
        headers: [{ text: 'Shows', value: 'v' }],
        values: v.shows.map(v => ({ v }))
      },
      {
        id: 'locationHistory',
        headers: [{ text: 'Location History', value: 'v' }],
        values: v.locationHistory.map(v => ({ v }))
      },
      {
        id: 'partnerInterests',
        headers: [{ text: 'Partner Interests', value: 'v' }],
        values: v.partnerInterests.map(v => ({ v }))
      }
    ].map(
      ({ id, headers, ...rest }) =>
        ({
          id,
          headers: headers.map(({ text, ...headerRest }) =>
            ({ text: this.messages.tables[id].headers[text], ...headerRest })),
          ...rest
        })
    )
    return { items, tables }
  }
}
</script>
