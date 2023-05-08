import G6 from '@antv/g6'
const { getLabelPosition, transform } = G6.Util

G6.registerEdge(
  'arrow-running',
  {
    afterDraw(cfg, group) {
      // get the first shape in the group, it is the edge's path here=
      const shape = group.get('children')[0]

      const arrow = group.addShape('marker', {
        attrs: {
          x: 16,
          y: 0,
          r: 8,
          lineWidth: 2,
          stroke: '#3370ff',
          fill: '#fff',
          symbol: (x, y, r) => {
            return [
              ['M', x - 6, y - 4],
              ['L', x - 2, y],
              ['L', x - 6, y + 4]
            ]
          }
        }
      })

      // animation for the red circle
      arrow.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio)
          const pos = getLabelPosition(shape, ratio)
          let matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
          matrix = transform(matrix, [
            ['t', -tmpPoint.x, -tmpPoint.y],
            ['r', pos.angle],
            ['t', tmpPoint.x, tmpPoint.y]
          ])

          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
            matrix
          }
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 3000 // the duration for executing once
        }
      )
    }
  },
  'line' // extend the built-in edge 'cubic'
)
