import { ColumnAccessor } from '../utils/types'
export default {
  props: {
    xColumn: {
      type: ColumnAccessor,
      required: true,
      placeHolder: 'Choose the column to use for the x values'
    },
    yColumn: {
      type: ColumnAccessor,
      required: true,
      placeHolder: 'Choose the column to use for the y values'
    },
    xLabel: {
      type: String,
      default: () => '',
      placeHolder: 'Choose the label for the x axis'
    },
    yLabel: {
      type: String,
      default: () => '',
      placeHolder: 'Choose the label for the y axis'
    }
  }
}
