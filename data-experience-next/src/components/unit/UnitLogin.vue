<template>
  <VContainer
    fluid
    style="max-width: 400px"
    class="mt-16"
  >
    <h1 class="text-h4 mb-6">
      Login
    </h1>
    <VForm @submit.prevent="login">
      <VTextField
        :value="id"
        label="ID"
        readonly
      />
      <BasePasswordField
        :value.sync="codeword"
        :error-message.sync="errorMessage"
        autofocus
        label="Codeword"
      />
      <BaseButton type="submit">
        Login
      </BaseButton>
    </VForm>
  </VContainer>
</template>

<script>
import BubbleAPI from '@/utils/bubble-api'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BasePasswordField from '@/components/base/BasePasswordField.vue'
import { mapState } from '@/utils/store-helper'

export default {
  name: 'UnitLogin',
  components: {
    BasePasswordField,
    BaseButton
  },
  data() {
    return {
      errorMessage: '',
      codeword: this.bubbleCodeword || '',
      loginSuccessful: false
    }
  },
  computed: {
    ...mapState(['bubbleCodeword', 'bubbleConfig']),
    id() {
      return this.bubbleConfig.id
    },
    bubbleAPI() {
      return new BubbleAPI(this.bubbleConfig.apiUrl)
    }
  },
  methods: {
    async login() {
      try {
        const { id, codeword } = this
        if (!codeword) {
          this.errorMessage = 'Please enter the codeword'
          return
        }
        const error = await this.bubbleAPI.login(id, codeword)
        if (error) {
          this.errorMessage = error
        } else {
          this.$store.commit('xp/setBubbleCodeword', codeword)
          this.$emit('success')
        }
      } catch (error) {
        this.errorMessage = [
          'An unknown error occurred, we apologize for the inconvenience.',
          'Please report the error via e-mail to contact@hestialabs.org)',
          error
        ].join(' ')
        console.error(error)
      }
    }
  }
}
</script>
