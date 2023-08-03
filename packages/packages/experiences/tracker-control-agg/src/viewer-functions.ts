import {
  toGraph,
  toGraphAll,
  toGraphAllCategories,
  toGraphAllInclusion
} from './postprocessors'

const viewerFunctions = {
  postprocessors: {
    toGraph: toGraph,
    toGraphAllCategories: toGraphAllCategories,
    toGraphAllInclusion: toGraphAllInclusion,
    toGraphAll: toGraphAll
  },
  customPipelines: {}
}

export default viewerFunctions
