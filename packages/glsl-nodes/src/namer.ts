import { snakeCase } from 'scule'

type GetUniqueName = (name: string) => string

export interface Namer {
  variable: GetUniqueName
  constant: GetUniqueName
  attribute: GetUniqueName
  uniform: GetUniqueName
  varying: GetUniqueName
}

export const createNamer = (): Namer => {
  const uniqueNames = new Map<string, number>()
  const getUniqueName: GetUniqueName = (name) => {
    const instance = uniqueNames.get(name) ?? 0
    uniqueNames.set(name, instance + 1)
    return `${name}_${instance}`
  }

  const variable: GetUniqueName = (name) =>
    getUniqueName(snakeCase(name.replace(/[^\w\d_]/g, '').replace(/^(\d)/, '_$1')))
  const constant: GetUniqueName = (name) =>
    getUniqueName(snakeCase(name.replace(/[^\w\d_]/g, '').replace(/^(\d)/, '_$1')).toUpperCase())
  const attribute: GetUniqueName = (name) =>
    getUniqueName(`a_${snakeCase(name.replace(/[^\w\d_]/g, ''))}`)
  const uniform: GetUniqueName = (name) =>
    getUniqueName(`u_${snakeCase(name.replace(/[^\w\d_]/g, ''))}`)
  const varying: GetUniqueName = (name) =>
    getUniqueName(`v_${snakeCase(name.replace(/[^\w\d_]/g, ''))}`)

  return {
    variable,
    constant,
    attribute,
    uniform,
    varying,
  }
}
