export default {
  Map: jest.fn(() => ({
    on: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    getLayer: jest.fn(),
    setLayoutProperty: jest.fn(),
    fitBounds: jest.fn(),
    remove: jest.fn()
  }))
}
