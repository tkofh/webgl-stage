export interface Writer {
  mode: 'vertex' | 'fragment'
  addGlobal: (glsl: string) => void
  addMainBody: (glsl: string) => void
  compile: () => string
}

export const createWriter = (mode: 'vertex' | 'fragment'): Writer => {
  const globals: string[] = []

  const mainBody: string[] = []

  return {
    mode,
    addGlobal: (glsl) => {
      globals.push(glsl)
    },

    addMainBody: (glsl) => {
      mainBody.push(glsl)
    },
    compile: () => [...globals, `void main() {`, ...mainBody, `}`].join('\n'),
  }
}
