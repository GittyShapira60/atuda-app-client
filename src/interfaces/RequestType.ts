export interface Flow {
  options: Option[] | string[]
  layout: string
  menuTitle: string
  isDepend: boolean
}

export interface Option {
  name: string
  displayName: string
}
