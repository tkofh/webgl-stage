export interface Writer {
  mode: 'vertex' | 'fragment'
  addGlobal: (glsl: string) => void
  // addFunction: (name: string, returnType: string, parameters: string) => void
  // addFunctionBody: (functionName: string, glsl: string) => void
  addMainBody: (glsl: string) => void
  compile: () => string
}

export const createWriter = (mode: 'vertex' | 'fragment'): Writer => {
  const globals: string[] = []

  // const functions = new Map<string, string[]>()
  // const functionOrder: string[] = []

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
