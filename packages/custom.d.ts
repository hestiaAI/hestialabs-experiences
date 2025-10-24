declare module '@/icons/*' {
  const value: string
  export default value
}

declare module '*.sql' {
  const value: string
  export default value
}

declare module '*package.json' {
  const value: {
    name: string
    version: string
    [key: string]: string
  }
  export default value
}

declare module '*messages.json' {
  const value: Messages
  export default value
}

declare module '*viewer.json' {
  const value: object
  export default value
}

declare module '*model.json' {
  const value: object
  export default value
}

declare module '@/data-samples/*' {
  const value: string
  export default value
}

declare module '@/data-samples/*.json' {
  const value: string
  export default value
}

declare module 'ngraph.graph'
declare module 'ngraph.centrality'
