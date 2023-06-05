<template>
  <VContainer fluid fill-height>
    <VLayout align-center justify-center fill-height>
      <VFlex xs12 sm8 md4>
        <VCard flat background-color="primary">
          <VToolbar flat>
            <VToolbarTitle>Login</VToolbarTitle>
          </VToolbar>
          <VDivider />
          <VCardText>
            <VForm>
              <VTextField
                v-model="username"
                :prepend-icon="$vuetify.icons.values['mdiAccount']"
                name="username"
                label="Username"
                type="text"
              />
              <VTextField
                id="password"
                v-model="password"
                :prepend-icon="$vuetify.icons.values['mdiLock']"
                name="password"
                label="Password"
                type="password"
              />
            </VForm>
          </VCardText>

          <VCardActions>
            <span v-if="error" class="caption red--text mr-4">{{ errorMsg }}</span>
            <span v-else-if="success" class="caption green--text mr-4">{{ successMsg }}</span>
            <VSpacer />
            <BaseButton color="primary" v-bind="{error, success, progress: loading}" @click="login">
              Login
            </BaseButton>
          </VCardActions>
        </VCard>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { loginDashboard } from '@/utils/serverless-api'

export default {
  name: 'LoginScreen',
  data() {
    return {
      username: null,
      password: null,
      loading: false,
      error: false,
      errorMsg: '',
      success: false,
      successMsg: ''
    }
  },
  methods: {
    login() {
      this.success = false
      this.error = false
      this.loading = true
      loginDashboard(this.username, this.password)
        .then((r) => {
          this.loading = false
          this.success = true
          this.successMsg = 'Successfully logged in!'
          this.$emit('success', r.presignedUrl)
        }).catch((e) => {
          this.loading = false
          this.error = true
          this.errorMsg = e
        })
    }
  }
}
</script>

<style></style>
