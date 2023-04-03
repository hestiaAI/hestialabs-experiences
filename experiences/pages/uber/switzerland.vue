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
      <p class="text-h6 mt-6">
        Nous avons développé un outil pour vous aider à analyser vos données Uber. Cet outil permet de transformer vos données bruts en données comptables. Vous pouvez ensuite les utiliser pour calculer vos arriérés, vos gains et vos coûts. Vous pouvez aussi visualiser votre temps de travail et vos km parcourus, y compris à vide (sans client).
      </p>
      <section ref="get-your-data" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Quelle est votre situation ?
            </div>
            <div class="text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6">
              1. Vous avez déjà récupéré vos données
            </div>
            <p class="text-h6">
              Vous avez déjà reçu deux emails « message de Uber », le premier contenant un lien pour accéder à vos données personnelles, le second contenant le mot de passe pour y accéder ?
            </p>
            <p class="text-h6">
              Alors c’est tout bon ! Déposez ci-dessous le fichier .zip récupéré auprès d’Uber pour obtenir l’analyse personnalisée de votre activité. Des éléments à partager avec votre avocat et/ou votre syndicat afin d’engager une procédure légale contre Uber.
            </p>
          </VCol>
        </VRow>
        <VRow justify="center">
          <VCol cols="12" md="8" lg="6" align-self="center" class="text-center">
            <FileUploader platform="uber" country="switzerland" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <p class="text-h6">
              Une fois votre archive transmise, vérifiez la boite email associée à votre compte Uber. Après avoir vérifié que la qualité de vos données nous permet de faire une analyse utile, nous vous recontacterons par email. Le lien dans cet email vous permettra de payer 100 € (TTC) pour obtenir votre fichier personnalisé d'analyse de votre activité Uber ainsi que 6 mois de suivi de votre dossier personnalisé (tarif de lancement, susceptible de changer à tout moment). Le détail exact de la prestation sera inclus dans l'email envoyé avant payement.
            </p>
          </VCol>
        </VRow>
      </section>
      <section ref="get-your-data" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6">
              2. Vous n’avez pas encore récupéré vos données Uber?
            </div>
            <p class="text-h6">
              Utilisez votre droit d’accès RGPD pour demander à Uber vos données précises d’activité en suivant
              <ExternalLink href="https://personaldata.io/nos-donnees-nos-projets/mobilite/uber/rgpd/">
                le protocole indiqué sur cette page de l’association d’intérêt public PersonalData.io, notre partenaire.
              </ExternalLink>* L'accompagnement est aussi rendu possible via notre partenaire INV VTC.
            </p>
            <span class="caption">*Que vous travailliez dans un pays de l’UE (<ExternalLink href="https://www.privacy-regulation.eu/fr/15.htm">RGPD art. 15</ExternalLink>) ou en Suisse (<ExternalLink href="https://www.fedlex.admin.ch/eli/cc/1993/1945_1945_1945/fr#a8">LPD art. 8</ExternalLink>), Uber doit vous donner vos données, c’est la loi.</span>
          </VCol>
        </VRow>
      </section>
      <section class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h5 font-weight-bold blue-grey--text text--darken-2 mb-6">
              3. Vous avez déjà demandé vos données Uber mais n’avez pas encore reçu le fichier
            </div>
            <p class="text-h6">
              Uber est tenu de vous répondre dans un délai d'un mois au plus tard. Si vous n'avez toujours pas reçu de réponse dans ce délai, vous pouvez nous contacter via <a :href="discordLink" target="blank">Discord</a> ou <a :href="whatsAppLink" target="blank">Whatsapp</a>.
            </p>
          </VCol>
        </VRow>
      </section>
      <section class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Nos Partenaires
            </div>
            <VRow align="center">
              <VCol cols="12" md="4" class="pa-2">
                <VImg src="/personaldataio_logo.jpg" contain />
              </VCol>
              <VCol cols="12" md="4" class="pa-2">
                <VImg src="/hestiaai_logo.svg" contain />
              </VCol>
              <VCol cols="12" md="4" class="pa-2">
                <VImg src="/INV-VTC_logo.jpg" contain />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </section>
      <section ref="contact" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Besoin d'aide ?
            </div>
            <p class="text-h6">
              Contactez nous via Discord ou WhatsApp, nous vous répondrons dans les plus brefs délais.
            </p>
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-space-around">
              <BaseIconCard :href="whatsAppLink" icon="mdiWhatsapp" text="WhatsApp" color="#23D366" />
              <BaseIconCard :href="discordLink" icon="/discord-mark-white.svg" text="Discord" color="#5865F2" />
            </div>
          </VCol>
        </VRow>
      </section>
    </VContainer>
  </div>
</template>

<script>
import mixinPage from '@/mixins/page'
import FileUploader from '@/components/FileUploader.vue'

export default {
  components: { FileUploader },
  mixins: [mixinPage],
  data() {
    return {
      whatsAppLink: 'https://chat.whatsapp.com/C8NHw4OBveHCTLgWNddD2L',
      discordLink: 'https://discord.gg/MSKQHjEF'
    }
  },
  head() {
    return this.vueMeta('Uber')
  }
}
</script>

<style scoped>
.banner-wrapper {
  background: var(--v-primary-base);
  padding: 20px;
  min-height: 300px;
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
