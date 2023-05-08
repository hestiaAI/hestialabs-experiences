<template>
  <div :class="{fullscreen: fullscreen}">
    <VCard outlined class="pa-3 ma-0 fill-height fill-width">
      <div :id="graphId" :ref="graphId" />
    </VCard>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import '@/utils/g6-types'
export default {
  name: 'NetworkGraph',
  props: {
    width: {
      type: Number,
      default: () => null
    },
    height: {
      type: Number,
      default: () => 500
    },
    margin: {
      type: Number,
      default: () => 0
    },
    nodes: {
      type: Array,
      default: () => []
    },
    edges: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid,
      graph: null,
      fullscreen: false
    }
  },
  computed: {
    graphData() {
      // Convert to G6 format
      return {
        nodes: this.nodes.map(node => ({
          ...node,
          style: {
            fill: node.color
          },
          labelCfg: {
            style: {
              fill: '#fff', // The color of the text
              fontSize: 12, // The size of the text
              fontWeight: 600, // The font weight of the text
              fontFamily: 'Arial', // The font family of the text
              background: {
                fill: node.color,
                padding: 3,
                radius: 4,
                lineWidth: 4
              }
            }
          }
        })),
        edges: this.edges.map(edge => ({
          ...edge,
          id: `edge_${edge.id}`,
          target: edge.target.toString(),
          style: {
            lineWidth: edge.lineWidth,
            stroke: edge.color,
            endArrow: edge.endArrow,
            startArrow: edge.startArrow,
            lineDash: edge.lineDash ? [0, 2, 2, 0] : null
          },
          labelCfg: {
            style: {
              fill: '#000', // The color of the text
              fontSize: 8, // The size of the text
              fontWeight: 400, // The font weight of the text
              fontFamily: 'Arial', // The font family of the text
              background: {
                fill: '#fff',
                padding: [2, 2, 2, 2],
                radius: 4,
                lineWidth: 3
              }
            }
          }
        }))
      }
    }
  },
  watch: {
    nodes() {
      this.updateViz()
    },
    edges() {
      this.updateViz()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.computedWidth = this.width || this.$refs[this.graphId].offsetWidth
      this.drawViz()
    })
  },
  methods: {
    drawViz() {
      const toolbar = new G6.ToolBar({
        getContent: () => {
          return `
            <ul>
              <li code="zoomOut">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                  <title>Zoom Out</title>
                  <path d="M658.432 428.736a33.216 33.216 0 0 1-33.152 33.152H525.824v99.456a33.216 33.216 0 0 1-66.304 0V461.888H360.064a33.152 33.152 0 0 1 0-66.304H459.52V296.128a33.152 33.152 0 0 1 66.304 0V395.52H625.28c18.24 0 33.152 14.848 33.152 33.152z m299.776 521.792a43.328 43.328 0 0 1-60.864-6.912l-189.248-220.992a362.368 362.368 0 0 1-215.36 70.848 364.8 364.8 0 1 1 364.8-364.736 363.072 363.072 0 0 1-86.912 235.968l192.384 224.64a43.392 43.392 0 0 1-4.8 61.184z m-465.536-223.36a298.816 298.816 0 0 0 298.432-298.432 298.816 298.816 0 0 0-298.432-298.432A298.816 298.816 0 0 0 194.24 428.8a298.816 298.816 0 0 0 298.432 298.432z"></path>
                </svg>
              </li>
              <li code="zoomIn">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                  <title>Zoom In</title>
                  <path d="M639.936 416a32 32 0 0 1-32 32h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 32 32z m289.28 503.552a41.792 41.792 0 0 1-58.752-6.656l-182.656-213.248A349.76 349.76 0 0 1 480 768 352 352 0 1 1 832 416a350.4 350.4 0 0 1-83.84 227.712l185.664 216.768a41.856 41.856 0 0 1-4.608 59.072zM479.936 704c158.784 0 288-129.216 288-288S638.72 128 479.936 128a288.32 288.32 0 0 0-288 288c0 158.784 129.216 288 288 288z" p-id="3853"></path>
                </svg>
              </li>
              <li code="autoZoom">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
                  <title>Recenter</title>
                  <path d="M684.288 305.28l0.128-0.64-0.128-0.64V99.712c0-19.84 15.552-35.904 34.496-35.712a35.072 35.072 0 0 1 34.56 35.776v171.008h170.944c19.648 0 35.84 15.488 35.712 34.432a35.072 35.072 0 0 1-35.84 34.496h-204.16l-0.64-0.128a32.768 32.768 0 0 1-20.864-7.552c-1.344-1.024-2.816-1.664-3.968-2.816-0.384-0.32-0.512-0.768-0.832-1.088a33.472 33.472 0 0 1-9.408-22.848zM305.28 64a35.072 35.072 0 0 0-34.56 35.776v171.008H99.776A35.072 35.072 0 0 0 64 305.216c0 18.944 15.872 34.496 35.84 34.496h204.16l0.64-0.128a32.896 32.896 0 0 0 20.864-7.552c1.344-1.024 2.816-1.664 3.904-2.816 0.384-0.32 0.512-0.768 0.768-1.088a33.024 33.024 0 0 0 9.536-22.848l-0.128-0.64 0.128-0.704V99.712A35.008 35.008 0 0 0 305.216 64z m618.944 620.288h-204.16l-0.64 0.128-0.512-0.128c-7.808 0-14.72 3.2-20.48 7.68-1.28 1.024-2.752 1.664-3.84 2.752-0.384 0.32-0.512 0.768-0.832 1.088a33.664 33.664 0 0 0-9.408 22.912l0.128 0.64-0.128 0.704v204.288c0 19.712 15.552 35.904 34.496 35.712a35.072 35.072 0 0 0 34.56-35.776V753.28h170.944c19.648 0 35.84-15.488 35.712-34.432a35.072 35.072 0 0 0-35.84-34.496z m-593.92 11.52c-0.256-0.32-0.384-0.768-0.768-1.088-1.088-1.088-2.56-1.728-3.84-2.688a33.088 33.088 0 0 0-20.48-7.68l-0.512 0.064-0.64-0.128H99.84a35.072 35.072 0 0 0-35.84 34.496 35.072 35.072 0 0 0 35.712 34.432H270.72v171.008c0 19.84 15.552 35.84 34.56 35.776a35.008 35.008 0 0 0 34.432-35.712V720l-0.128-0.64 0.128-0.704a33.344 33.344 0 0 0-9.472-22.848zM512 374.144a137.92 137.92 0 1 0 0.128 275.84A137.92 137.92 0 0 0 512 374.08z"></path>
                </svg>
              </li>
              <li code="screenShot">
                <title>Export to image</title>
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="24">
                  <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
                </svg>
              </li>
              <li code="expandAll">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="24">
                  <title>Expand All</title>
                  <path d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z" />
                </svg>
              </li>
            </ul>
          `
        },
        handleClick: (code, graph) => {
          if (code === 'expandAll') {
            this.fullscreen = !this.fullscreen
            const width = this.fullscreen ? window.innerWidth : this.computedWidth
            const height = this.fullscreen ? window.innerHeight : this.height
            graph.changeSize(width, height)
            toolbar.autoZoom()
            if (this.fullscreen) {
              graph.addBehaviors({ type: 'zoom-canvas', sensitivity: 1 }, 'default')
            } else {
              graph.removeBehaviors('zoom-canvas', 'default')
            }
          } else if (code === 'screenShot') {
            graph.downloadFullImage()
          } else {
            // Other operations remain default
            toolbar.handleDefaultOperator(code)
          }
        }
      })

      this.graph = new G6.Graph({
        container: this.graphId,
        fitView: true,
        width: this.computedWidth,
        height: this.height,
        plugins: [toolbar],
        modes: {
          default: [
            'drag-canvas',
            'drag-node',
            {
              type: 'tooltip', // Node tooltip
              formatText(model) {
                return model.description
              },
              // Hide tooltip of no description
              shouldBegin(e) {
                return e.item._cfg.model.description
              }
            },
            {
              type: 'edge-tooltip', // Edge tooltip
              formatText(model) {
                return model.description
              },
              // Hide tooltip of no description
              shouldBegin(e) {
                return e.item._cfg.model.description
              }
            }
          ]
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          nodeSpacing: 100,
          center: [this.computedWidth / 2, this.height / 2]
        }
      })

      // Draw viz
      this.updateViz()
    },
    updateViz() {
      this.graph.data(this.graphData)
      this.graph.render()
    }
  }
}
</script>
<style scoped>
    /* The style of the tooltip */
    .fullscreen {
      position: absolute;
      left: 0;
      top: -60px;
      height: 100vh;
      width: 100vw;
      z-index: 10000;
      overflow: hidden;
    }
    ::v-deep .g6-tooltip {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      color: #545454;
      background-color: rgba(255, 255, 255, 1);
      padding: 10px 8px;
      box-shadow: rgb(174, 174, 174) 0px 0px 10px;
    }
    ::v-deep .g6-component-toolbar {
      border: none;
      right: 0;
      left: auto;
    }
  </style>
