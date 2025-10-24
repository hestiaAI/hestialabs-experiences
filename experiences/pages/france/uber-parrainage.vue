<template>
  <div>
    <VBanner color="warning" sticky dark>
      <VIcon class="mr-6">
        $vuetify.icons.mdiInformationOutline
      </VIcon>
      Nous regrettons de vous informer que ce service n'est plus disponible. Nous vous remercions pour votre compréhension
    </VBanner>
    <div class="banner-wrapper">
      <VContainer>
        <div class="text-center">
          <h1 class="banner-title font-weight-bold white--text text-uppercase text-break">
            Parlez d’Horkos Deluxe, Gagnez de l’argent
          </h1>
          <h6 class="text-h6 white--text">
            Vous recevrez 50 euros à chaque fois qu’un chauffeur utilise notre service grâce à vous.
          </h6>
        </div>
      </VContainer>
    </div>
    <VContainer>
      <section ref="description" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <p class="text-h6 mt-6">
              <strong>Horkos Deluxe est un assistant juridique 2.0 pour chauffeurs Uber.</strong>
              Il aide les chauffeurs à récupérer leurs données Uber, il les analyse et produit les documents qui leurs permettent d'engager des procédures légales (preuves) contre la plateforme.
            </p>
            <p class="text-h6 mt-6">
              <strong>Horkos Deluxe est aussi un super comptable pour chauffeurs VTC.</strong> Il calcule tous les éléments qui permettent à un chauffeur Uber de déterminer la rentabilité de son activité : kilomètres parcourus et temps de connexion, en course (P3), en approche (P2) et en disponibilité (P1), le jour, la nuit, le week-end, partage des revenus avec Uber…
            </p>
            <p class="text-h6 mt-6">
              Nous vous proposons de <strong>gagner de l’argent</strong> en parlant de ce service aux chauffeurs que vous connaissez.
            </p>
          </VCol>
        </VRow>
      </section>
      <section ref="how" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <div class="text-h4 font-weight-bold blue-grey--text text--darken-2 mb-6">
              Comment ça marche ?
            </div>
            <p class="text-h6 mt-6">
              <ol>
                <li>
                  Inscrivez-vous au programme de parrainage en remplissant le formulaire ci-dessous.
                </li>
                <li>
                  Vous recevrez un code personnel par email. Partagez-le avec des chauffeurs Uber.
                </li>
                <li>
                  <span class="red--text font-weight-bold">À chaque fois qu’un chauffeur utilise votre code personnel</span> en cliquant sur le bouton « Souscrivez au service Horkos Deluxe » sur
                  <NuxtLink to="/france/uber">
                    <span>cette page</span>
                  </NuxtLink>, il bénéficie de <span class="red--text font-weight-bold">60% de réduction</span> (60 euros au lieu de 150 euros) et <span class="red--text font-weight-bold">nous vous versons 50 euros</span> par chauffeur parrainé.
                </li>
              </ol>
            </p>
            <p class="text-h6 mt-6">
              Attention cette offre n'est valable que jusqu'au 30 avril.
            </p>
          </VCol>
        </VRow>
      </section>
      <section ref="subscribe" class="section-wrapper">
        <VRow>
          <VCol cols="12">
            <AffiliateForm country="France" />
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
import AffiliateForm from '@/components/forms/AffiliateForm.vue'
export default {
  components: { AffiliateForm },
  mixins: [mixinPage],
  data() {
    return {
      whatsAppLink: 'https://chat.whatsapp.com/C8NHw4OBveHCTLgWNddD2L',
      discordLink: 'https://discord.gg/MSKQHjEF'
    }
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
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
