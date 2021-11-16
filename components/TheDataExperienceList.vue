<template>
  <div>
    <template v-if="enabledExperiences.length > 0">
      <h1>Public experiences</h1>
      <card-or-item-list :small="small" :experiences="enabledExperiences" />
    </template>
    <br /><br /><br />
    <template v-if="disabledExperiences.length > 0">
      <h1>
        Available on-demand (
        <a href="mailto:contact@hestialabs.org"> Contact us </a>
        )
      </h1>
      <card-or-item-list :small="small" :experiences="disabledExperiences" />
    </template>
  </div>
</template>
<script>
import CardOrItemList from '~/components/CardOrItemList'
export default {
  name: 'TheDataExperienceList',
  components: { CardOrItemList },
  props: {
    small: {
      type: Boolean,
      default: undefined
    },
    enabledExperiences: {
      type: Array,
      required: true
    },
    disabledExperiences: {
      type: Array,
      required: true
    }
  }
}
</script>
