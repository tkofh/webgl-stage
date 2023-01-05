export interface Writer {
  addGlobal: (glsl: string) => void
  // addFunction: (name: string, returnType: string, parameters: string) => void
  // addFunctionBody: (functionName: string, glsl: string) => void
  addMainBody: (glsl: string) => void
  compile: () => string
}

export const createWriter = (): Writer => {
  const globals: string[] = []

  // const functions = new Map<string, string[]>()
  // const functionOrder: string[] = []

  const mainBody: string[] = []

  return {
    addGlobal: (glsl) => {
      globals.unshift(glsl)
    },
    // addFunction: (name, returnType, parameters) => {
    //   functions.set(name, [`${returnType} ${name}(${parameters}) {`])
    //   functionOrder.push(name)
    // },
    // addFunctionBody: (functionName, glsl) => {
    //   const func = functions.get(functionName)
    //   if(!func) {
    //     throw new Error(`Unknown function ${functionName}`)
    //   }

    //   func.push(glsl)
    // },
    addMainBody: (glsl) => {
      mainBody.unshift(glsl)
    },
    compile: () => [...globals, `void main() {`, ...mainBody, `}`].join('\n'),
  }
}
