/**
 * In this file we define custom types for charts' props
 * usefull for generating forms from a component props
 */

/**
 * ColumnAccessor tells the form generator to provide a select on
 * the columns of the table
 */
export class ColumnAccessor {
  constructor(columnName) {
    this.columnName = columnName
  }
}

/**
 * Orientation provides an enum for selecting orientation of graphs
 */
export class Orientation {
  static enum = ['Vertical', 'Horizontal']
  constructor(orientation) {
    if (Orientation.enum.includes(orientation)) {
      this.orientation = orientation
    } else {
      const defaultOrientation = Orientation.enum[0]
      console.error(
        'Unrecognized Orientation, will use default: ',
        defaultOrientation
      )
      this.orientation = defaultOrientation
    }
  }
}

/**
 * Color provides a color selector in the chart form
 */
export class Color {
  constructor(color) {
    if (color) this.color = color
    else this.color = '#58539e'
  }
}
