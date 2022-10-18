<template>
  <VTextField
    v-model="password"
    :label="label"
    placeholder="Type..."
    required
    :type="passwordType"
    :append-icon="passwordAppendIcon"
    error-count="10"
    :error-messages="errorMessages"
    v-bind="$attrs"
    @click:append="onClickAppend"
  />
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  props: {
    errorMessage: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Password'
    }
  },
  data() {
    return {
      password: '',
      passwordType: 'password',
      passwordAppendIcon: mdiEye,
      errorMessages: this.errorMessage
    }
  },
  watch: {
    errorMessage(value) {
      this.errorMessages = value
    },
    errorMessages(value) {
      this.$emit('update:error-message', value)
    },
    password(password) {
      this.errorMessages = ''
      this.$emit('update:value', password)
    }
  },
  methods: {
    onClickAppend() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
        this.passwordAppendIcon = mdiEyeOff
      } else {
        this.passwordType = 'password'
        this.passwordAppendIcon = mdiEye
      }
    }
  }
}
</script>
