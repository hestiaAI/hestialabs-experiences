<template>
  <div>
    <div v-if="isValid && !isEmpty" ref="view">
      <component :is="component" v-bind="{ values, headers, ...vizProps }" />
    </div>
    <i v-else-if="isValid">No data found</i>
    <i v-else>Data in this format cannot be displayed by this visualization</i>
    <BaseButton icon="mdiExport" text="Export" @click="exportFiles" />
    <BaseButtonShare file-share :disabled="!files" :files="files" />
  </div>
</template>

<script>
import _ from 'lodash'
import { processError } from '@/utils/utils'

function isDataValid(data) {
  return (
    _.every(
      ['items', 'headers'],
      field => _.has(data, field) && Array.isArray(data[field])
    ) &&
    data.headers.length > 0 &&
    _.every(data.items, i => _.every(data.headers, h => _.has(i, h)))
  )
}

function isDataEmpty(data) {
  return data.items.length === 0
}

// inspired by https://github.com/JuanIrache/d3-svg-to-png
function svgToFile(
  svgElement,
  filename,
  { scale = 1, format = 'png', quality = 1 }
) {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const canvas = document.createElement('canvas')
  const svgSize = svgElement.getBoundingClientRect()

  // Resize can break shadows
  canvas.width = svgSize.width * scale
  canvas.height = svgSize.height * scale
  canvas.style.width = svgSize.width
  canvas.style.height = svgSize.height

  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)

  const img = document.createElement('img')
  img.setAttribute(
    'src',
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  )

  const type = `image/${format}`

  return new Promise(resolve => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        blob => {
          img.onload = null
          resolve(new File([blob], `${filename}.${format}`, { type }))
        },
        type,
        quality
      )
    }
  })
}

export default {
  props: {
    data: {
      default: undefined,
      validator: isDataValid
    },
    graphName: {
      type: String,
      required: true
    },
    vizProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      files: null,
      progress: false,
      status: false,
      error: false
    }
  },
  computed: {
    isValid() {
      return isDataValid(this.data)
    },
    isEmpty() {
      return isDataEmpty(this.data)
    },
    values() {
      return this.data.items || {}
    },
    headers() {
      return this.data.headers || []
    },
    component() {
      return () => import(`@/components/chart/view/${this.graphName}`)
    }
  },
  methods: {
    async exportFiles() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        const format = 'png'

        const svgs = [...this.$refs.view.querySelectorAll('svg')].filter(
          // avoid including Vuetify icons
          el => !el.classList.contains('v-icon__svg')
        )
        this.files = await Promise.all(
          svgs.map((svg, index) => {
            const filename = `chart-${index}`
            return svgToFile(svg, filename, { format })
          })
        )
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
}
</script>
