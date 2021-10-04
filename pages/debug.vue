<template>
  <div>
    <h1>How did you get here?</h1>
    <p>This is just to test netlify forms file</p>
    <template>
      <section>
        <div>
          <form ref="form" name="file-upload" method="post" data-netlify="true">
            <div>
              <input type="hidden" name="form-name" value="file-upload" />
              <div>
                <input
                  for="name"
                  type="text"
                  name="name"
                  required
                  placeholder="Name"
                />
              </div>
              <div>
                <input type="file" name="picture" />
              </div>
              <div>
                <button
                  type="submit"
                  value="Send file"
                  @click.prevent="handleSubmit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      const myForm = this.$refs.form
      const formData = new FormData(myForm)
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => console.log('Form successfully submitted'))
        .catch(error => alert(error))
    }
  }
}
</script>
