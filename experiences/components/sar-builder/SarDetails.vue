<template>
  <VContainer>
    <span v-t="'sar-builder.infos-description'" class="blue-grey--text text--darken-2 mt-6 mb-6" />
    <VCard flat class="pa-3 mt-6">
      <VForm>
        <VRow>
          <VCol cols="6">
            <VTextField
              v-model="firstname"
              outlined
              label="First Name"
              placeholder="John"
              persistent-placeholder
              @input="updateModel"
            />
          </VCol>
          <VCol cols="6">
            <VTextField
              v-model="lastname"
              outlined
              label="Last Name"
              placeholder="Doe"
              persistent-placeholder
              @input="updateModel"
            />
          </vcol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VCombobox
              v-model="company"
              :items="companies"
              :filter="customFilter"
              label="Company"
              outlined
              class="text-center"
              item-value="email"
              item-text="name"
              clearable
              return-object
              @update:search-input="updateCompany"
            >
              <template #item="data">
                <VListItemContent>
                  <VListItemTitle>{{ data.item.name }} </VListItemTitle>
                  <VListItemSubtitle>{{ data.item.lang }}</VListItemSubtitle>
                </VListItemContent>
              </template>
            </VCombobox>
          </VCol>
        </VRow>
      </vform>
    </VCard>
  </VContainer>
</template>
<script>
import { fetchDataControllerEmails } from '@/utils/pdio-wiki'
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      firstname: this.value.firstname,
      lastname: this.value.lastname,
      companies: [
        { header: 'Select an option or create one' }
      ],
      company: this.value.company
    }
  },
  watch: {
    value(newValue) {
      this.firstname = newValue.firstname
      this.lastname = newValue.lastname
      this.company = newValue.company
    }
  },
  mounted() {
    fetchDataControllerEmails().then((pdioDPO) => { this.companies = [...pdioDPO, ...this.companies] })
  },
  methods: {
    k(key) {
      return `sar-builder.${key}`
    },
    customFilter(item, queryText) {
      return item && item.name?.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
    },
    updateModel() {
      this.$emit('input', {
        firstname: this.firstname,
        lastname: this.lastname,
        company: this.company
      })
    },
    updateCompany(company) {
      this.$emit('input', {
        firstname: this.firstname,
        lastname: this.lastname,
        company: this.company ? this.company.name === company ? this.company : { name: company, email: null } : null
      })
    }
  }
}
</script>
<style scoped>
</style>
