export default {
  props: {
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
