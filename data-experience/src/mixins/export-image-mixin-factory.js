import domtoimage from 'dom-to-image-more'
import { processError } from '@/utils/utils'

export default ({ refName = 'domToImageNode' } = {}) => ({
  data() {
    const extension = 'png'
    const filename = `chart.${extension}`
    return {
      progress: false,
      status: false,
      error: false,
      blob: null,
      files: null,
      extension,
      filename
    }
  },
  methods: {
    async exportImage() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        // turn root node of this component to a PNG blob
        this.blob = await domtoimage.toBlob(this.$refs[refName], {
          bgcolor: 'white',
          filter(node) {
            if (!node.classList) {
              return true
            }
            return !node.classList.contains('dom-to-image-exclude')
          }
        })
        this.files = [
          new File([this.blob], this.filename, {
            type: `image/${this.extension}`
          })
        ]
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
      } finally {
        this.progress = false
        this.status = true
      }
    }
  }
})
