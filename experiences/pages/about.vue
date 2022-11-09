<template>
  <VContainer class="mt-10">
    <h4 class="text-h4">
      About <strong>Digipower.academy</strong>
    </h4>
    <div class="mt-10">
      <p>
        Data literacy: ability to think critically about data in different contexts and examine the impact of different approaches when collecting, using and sharing data and information.
      </p>
      <p>
        Digipower.academy is a data collective as defined by <a href="https://www.hestialabs.org">HestiaLabs</a>, a <a href="https://www.hestia.ai">Hestia.ai</a> project enabled by <a href="https://www.migros-engagement.ch/en/news-projects/technology-ethics/hestialabs">the Migros Pioneer Fund</a>.
      </p>
      <p>
        Digipower.academy offers curricula grounded in participants' data to advance understanding of data use, individually and collectively.
      </p>
      <p>
        Digipower.academy uses educational tools (data experiences, SAR generators) developed by HestiaLabs under the terms of the Affero GNUGeneral Public Licence version 3 (<a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0-or-later</a>). Some of these tools and associated teaching methods are derived from the <a href="www.sitra.fi/en/projects/digipower-investigation">Digipower investigation</a> conducted for and with Sitra in 2021-2022.
      </p>
      <p>
        Digipower.academy relies on the expertise of <a href="https://www.personaldata.io">PersonalData.io</a> for data collectivization and governance. The probity implied by its non-profit status avoids any conflict of interest or abuse in the use of data.
      </p>
      <p>
        Other data collectives powered by HestiaLabs and guaranteed by PersonalData.io:
      </p>
      <div class="d-flex justify-space-around mt-10">
        <CollaboratorLink v-for="collaborator in collaborators" :key="collaborator.title" v-bind="{collaborator, width: 350}" />
      </div>
    </div>
  </VContainer>
</template>

<script>
import theEyeballsIcon from '@/assets/icons/the-eyeballs.svg'
import theDatingPrivacyCollectiveIcon from '@/assets/icons/dating-privacy-collective.svg'

export default {
  data() {
    return {
      collaborators: [
        {
          title: 'The Eyeballs Collective',
          icon: theEyeballsIcon,
          url: 'https://eyeballs.hestialabs.org/'
        },
        {
          title: 'The Dating Privacy Collective',
          icon: theDatingPrivacyCollectiveIcon,
          url: 'https://dating-privacy.hestialabs.org/'
        }
      ]
    }
  }
}
</script>
