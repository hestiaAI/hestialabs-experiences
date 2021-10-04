<template>
  <div>
    <h1>How did you get here?</h1>
    <p>This is just to test netlify forms file</p>
    <template>
      <section>
        <div>
          <form ref="form" name="file-upload" method="post" data-netlify="true">
            <div>
              <!-- <input type="hidden" name="form-name" value="file-upload" /> -->
              <div>
                <input
                  v-model="name"
                  for="name"
                  type="text"
                  name="name"
                  required
                  placeholder="Name"
                />
              </div>
              <div>
                <input type="file" name="picture" @change="handleFile" />
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
  data() {
    return {
      formName: 'file-upload',
      name: '',
      file: null
    }
  },
  methods: {
    handleFile(event) {
      const files = event.target.files
      const filename = files[0].name
      console.log('filename', filename)
      // const fileReader = new FileReader()
      // fileReader.addEventListener('load', () => {
      //   this.imageUrl = fileReader.result
      // })
      // fileReader.readAsDataURL(files[0])
      this.file = files[0]
    },
    handleSubmit() {
      console.log(this.name, this.file, this.formName)
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('form-name', this.formName)
      formData.append('file', this.file)
      // const myForm = this.$refs.form
      // console.log(myForm)
      // const formData = new FormData(myForm)
      fetch('/', {
        method: 'POST',
        // headers: { 'Content-Type': 'multipart/form-data' },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => console.log('Form successfully submitted'))
        .catch(error => alert(error))
    }
  }
}
</script>
