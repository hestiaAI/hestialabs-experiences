<template>
  <div>
    <div class="banner-wrapper">
      <VContainer>
        <div class="text-center">
          <h1 class="banner-title font-weight-bold white--text text-uppercase text-break">
            Chauffeurs Uber
          </h1>
          <h6 class="text-h6 white--text">
            Analysez ici votre activité Uber grâce à vos données.
          </h6>
        </div>
      </VContainer>
    </div>
    <VContainer>
      <section ref="get-your-data" class="section-wrapper">
        <VRow>
          <VCol cols="12" md="6">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              1ère étape: Récupérer vos données
            </div>
            <p class="text-h6">
              <ExternalLink href="https://myprivacy.uber.com/privacy/exploreyourdata/download">
                Cliquez ici
              </ExternalLink> pour demander vos données via le portail de téléchargement Uber ou suivez les instructions sur la vidéo*.
            </p>
            <span class="caption">*Que vous travailliez dans un pays de l’UE (<ExternalLink href="https://www.privacy-regulation.eu/fr/15.htm">RGPD art. 15</ExternalLink>) ou en Suisse (<ExternalLink href="https://www.fedlex.admin.ch/eli/cc/1993/1945_1945_1945/fr#a8">LPD art. 8</ExternalLink>), Uber doit vous donner vos données, c’est la loi.</span>
          </VCol>
          <VCol cols="12" md="6" align="center">
            <BaseVideo video-src="https://vimeo.com/774677671" width="100%" />
          </VCol>
        </VRow>
      </section>
      <section ref="contact" class="section-wrapper">
        <VRow>
          <VCol cols="12" md="6">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              2ème étape: Contactez-nous
            </div>
            <p class="text-h6">
              Participez à l’une de nos <a href="#permanences">permanences (à Genève, à Lausanne ou à Paris)</a> ou contactez-nous:
            </p>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex justify-space-around">
              <BaseIconCard href="https://chat.whatsapp.com/J9RyQxh5qYI9M64j8PFIxf" icon="mdiWhatsapp" text="Chat on WhatsApp" color="#23D366" />
              <BaseIconCard href="https://discord.gg/MSKQHjEF" icon="./discord-mark-white.svg" text="Join us on Discord" color="#5865F2" />
            </div>
          </VCol>
        </VRow>
      </section>
      <section ref="goals" class="section-wrapper">
        <VRow>
          <VCol cols="12" md="6">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              À quoi ça sert?
            </div>
            <p class="text-h6">
              <ul>
                <li>
                  Estimer les arriérés qui vous sont dûs si vous avez été requalifié en employé (comme par exemple à <ExternalLink href="https://www.ge.ch/document/decision-historique-dans-dossier-uber-chauffeurs-sont-salaries-pas-independants">
                    Genève
                  </ExternalLink>)
                </li>
                <li>Comparer vos gains à vos coûts</li>
                <li>Visualiser votre temps de travail et vos km parcourus, y compris à vide (sans client)</li>
                <li>Ne vous laissez plus manipuler par l’algorithme: où et quand gagnez vous le plus?</li>
              </ul>
            </p>
          </VCol>
          <VCol cols="12" md="6" align="center">
            <BaseVideo video-src="https://www.twitch.tv/videos/1648959623" width="100%" />
          </VCol>
        </VRow>
      </section>
      <section ref="tools" class="section-wrapper">
        <VRow>
          <VCol cols="12" md="12">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Nos outils
            </div>
            <p class="text-h6">
              Exemple pour un chauffeur Genevois travaillant pour Uber depuis mai 2019
            </p>
            <VImg src="/accounting_mockup_v2.png" width="100%" />
          </VCol>
        </VRow>
      </section>
      <section id="permanences" class="section-wrapper">
        <VRow>
          <VCol cols="12" md="6">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Besoin d'aide ?
            </div>
            <p class="text-h6">
              Nous organisons des permanences pour aider les chauffeurs Uber à reprendre le contrôle de leurs données.
              Veuillez vous référer au tableau suivant pour plus d'informations sur le lieu et les horaires de celles-ci.
            </p>
          </VCol>
          <VCol cols="12" md="6" align="center">
            <div class="overline">
              Planning des prochaines permanences
            </div>
            <VSimpleTable class="pa-3">
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Date
                    </th>
                    <th class="text-left">
                      Heure
                    </th>
                    <th class="text-left">
                      Lieu
                    </th>
                    <th class="text-left">
                      URL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in permanences"
                    :key="index"
                  >
                    <td>{{ item.Date }}</td>
                    <td>{{ item.Time }}</td>
                    <td>{{ item.Location }}</td>
                    <td>
                      <ExternalLink v-if="item.URL" :href="item.URL">
                        Click here
                      </ExternalLink>
                    </td>
                  </tr>
                </tbody>
              </template>
            </VSimpleTable>
            <span v-if="!permanences.length" class="caption">Aucune permanence n'est prévue pour le moment, veuillez revenir plus tard.</span>
          </VCol>
        </VRow>
      </section>
    </VContainer>
  </div>
</template>

<script>
import Papa from 'papaparse'
import * as d3 from 'd3'
const formatDate = d3.timeFormat('%d %b %Y')
const parseDate = d3.timeParse('%Y-%m-%d')

function validURL(url) {
  const regex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/
  return regex.test(url)
}

export default {
  data() {
    return {
      permanences: [],
      videoLink: `https://player.twitch.tv/?video=1648959623&parent=${window.location.hostname.replace(/^www\./, '')}&autoplay=false`
    }
  },
  mounted() {
    this.getPermanences()
  },
  methods: {
    async getPermanences() {
      const URL = `https://raw.githubusercontent.com/hestiaAI/fibery-public/main/permanences/uber-driver-permanences.csv?timestamp=${new Date().getTime()}`
      const res = await this.$axios.$get(URL)
      const { data } = Papa.parse(res, { header: true, escapeChar: '\\', skipEmptyLines: true })
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      this.permanences = data.map(({ URL, Date: date, ...rest }) => {
        const dateParsed = parseDate(date)
        return {
          ...rest,
          dateParsed,
          URL: validURL(URL) ? URL : validURL(`https://${URL}`) ? `https://${URL}` : null,
          Date: date ? formatDate(dateParsed) || date : null
        }
      }).filter(
        // Show permanences occurring today or later (live update)
        p =>
          p.dateParsed >= today
      )
    }
  }
}

</script>
<style scoped>
.banner-wrapper {
  background: var(--v-primary-base);
  padding: 20px;
  min-height: 200px;
  display: flex;
  align-items: center;
}
.banner-title {
  font-size: 4.5vw;
  display: inline-block;
  line-height:1.1em;
  margin: 20px 0;
}
.section-wrapper {
  margin-top: 60px;
  margin-bottom: 40px;
}
</style>
