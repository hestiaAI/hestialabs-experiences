<template>
  <VList nav>
    <VListItem
      link
      :to="localePath({ name: '/' })"
    >
      <VListItemIcon>
        <VIcon>$vuetify.icons.mdiHome</VIcon>
      </VListItemIcon>
      <VListItemTitle>{{ $t('Home') }}</VListItemTitle>
    </VListItem>

    <VListItem
      link
      :to="localePath({ name: 'experiences' })"
    >
      <VListItemIcon>
        <VIcon>$vuetify.icons.mdiChartScatterPlot</VIcon>
      </VListItemIcon>
      <VListItemTitle>{{ $t('Experiences') }}</VListItemTitle>
    </VListItem>

    <VListGroup
      :value="false"
      no-action
    >
      <template #prependIcon>
        <VIcon>$vuetify.icons.mdiAccountDetails</VIcon>
      </template>
      <template #activator>
        <VListItemTitle>{{ $t('Data Stories') }}</VListItemTitle>
      </template>
      <VListItem
        link
        :to="localePath({ name: 'story-id', params: { id: 'getting-around-the-lausanne-area' } })"
      >
        <VListItemTitle>{{ $t("getting-around-the-lausanne-area") }}</VListItemTitle>
      </VListItem>
    </VListGroup>

    <VListItem
      link
      :to="localePath({ name: 'spaces' })"
    >
      <VListItemIcon>
        <VIcon>$vuetify.icons.mdiDatabase</VIcon>
      </VListItemIcon>
      <VListItemTitle>{{ $tc('Data Space', 2) }}</VListItemTitle>
    </VListItem>

    <VListGroup
      :value="false"
      no-action
    >
      <template #prependIcon>
        <VIcon>$vuetify.icons.mdiTools</VIcon>
      </template>
      <template #activator>
        <VListItemTitle>{{ $tc('Tool', 2) }}</VListItemTitle>
      </template>
      <VListItem
        link
        :to="localePath({ name: 'tools-sar-builder' })"
      >
        <VListItemTitle>{{ $t("Sar Builder") }}</VListItemTitle>
      </VListItem>
      <VListItem
        link
        :to="localePath({ name: 'tools-tabulator' })"
      >
        <VListItemTitle>{{ $t("Tabulator") }}</VListItemTitle>
      </VListItem>
      <VListItem
        link
        :to="localePath({ name: 'tools-graphulator' })"
      >
        <VListItemTitle>{{ $t("Graphulator") }}</VListItemTitle>
      </VListItem>
      <VListItem
        link
        href="https://personaldata.io/digipower-academy-questionnaire/"
        target="_blank"
      >
        <VListItemTitle>{{ $t("Data Spaces Creator") }}</VListItemTitle>
      </VListItem>
    </VListGroup>

    <VListItem
      link
      :to="localePath({ name: 'privacy' })"
    >
      <VListItemIcon>
        <VIcon>$vuetify.icons.mdiShieldLockOutline</VIcon>
      </VListItemIcon>
      <VListItemTitle>{{ $t('Privacy') }}</VListItemTitle>
    </VListItem>

    <VListItem
      link
      :to="localePath({ name: 'about' })"
    >
      <VListItemIcon>
        <VIcon>$vuetify.icons.mdiHelp</VIcon>
      </VListItemIcon>
      <VListItemTitle>{{ $t('About') }}</VListItemTitle>
    </VListItem>
  </VList>
</template>
<script>
export default {
  name: 'TheAppMenu'
}
</script>
