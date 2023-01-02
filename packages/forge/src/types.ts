export type Replacement = string | number
export interface Replacements {
  [TReplacement: string]: Replacement
}



export interface CompiledProgram {
  vertexShader: string
  fragmentShader: string
}

export interface Program<TReplacements extends Replacements> {
  compile: (replacemenets: TReplacements) => CompiledProgram
}
