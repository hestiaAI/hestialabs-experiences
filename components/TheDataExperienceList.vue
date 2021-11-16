<template>
  <div>
    <template v-if="enabledExperiences.length > 0">
      <h1>Public experiences</h1>
      <card-or-item-list :big="big" :experiences="enabledExperiences" />
    </template>
    <template v-if="big"> <br /><br /> </template>
    <template v-else> <br /> </template>
    <template v-if="disabledExperiences.length > 0">
      <h1>
        Available on-demand (<a href="mailto:contact@hestialabs.org"
          >Contact us</a
        >)
      </h1>
      <card-or-item-list :big="big" :experiences="disabledExperiences" />
    </template>
  </div>
</template>
<script>
import CardOrItemList from '~/components/CardOrItemList'
export default {
  name: 'TheDataExperienceList',
  components: { CardOrItemList },
  props: {
    big: {
      type: Boolean,
      required: true
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
