import { debounce } from 'perfect-debounce'
import mitt from 'mitt'
import type {
  Stage,
  StageAttribute,
  StageAttributeInfo,
  StageAttributes,
  StageConfig,
  StageEvents,
  StageUniform,
  StageUniforms,
} from './types'
import { stageUniformTypeToGLMethod } from './constants'

export const createStage = <TAttributes extends StageAttributes, TUniforms extends StageUniforms>(
  config: StageConfig<TAttributes, TUniforms>
): Stage<TAttributes, TUniforms> | Error => {
  const canvas = config.canvas ?? document.createElement('canvas')

  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')

  if (gl == null) {
    return new Error(`Failed to create stage: could not get webgl or webgl2 context from canvas.`)
  }

  const emitter = mitt<StageEvents<TAttributes, TUniforms>>()

  let vertexShader: WebGLShader | null = null
  let fragmentShader: WebGLShader | null = null
  let program: WebGLProgram | null = null
  let resizeObserver: ResizeObserver | null

  const attributes = new Map<keyof TAttributes, StageAttribute>(Object.entries(config.attributes))
  const attributeInfo = new Map<keyof TAttributes, StageAttributeInfo>()
  const uniforms = new Map<keyof TUniforms, StageUniform>(Object.entries(config.uniforms))
  const uniformLocations = new Map<keyof TUniforms, WebGLUniformLocation | null>()

  const dispose = () => {
    emitter.emit('before:dispose', gl)

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    gl.deleteProgram(program)

    for (const { buffer } of attributeInfo.values()) {
      gl.deleteBuffer(buffer)
    }
    attributeInfo.clear()

    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  }

  vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader!, config.vertexShader)
  gl.compileShader(vertexShader!)
  if (!gl.getShaderParameter(vertexShader!, gl.COMPILE_STATUS)) {
    const error = new Error(
      `Failed to create Stage: failed to compile Vertex Shader. Details:\n${gl.getShaderInfoLog(
        vertexShader!
      )}`
    )
    dispose()

    return error
  }

  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader!, config.fragmentShader)
  gl.compileShader(fragmentShader!)
  if (!gl.getShaderParameter(fragmentShader!, gl.COMPILE_STATUS)) {
    const error = new Error(
      `Failed to create Stage: failed to compile Fragment Shader. Details:\n${gl.getShaderInfoLog(
        fragmentShader!
      )}`
    )
    dispose()

    return error
  }

  program = gl.createProgram()
  gl.attachShader(program!, vertexShader!)
  gl.attachShader(program!, fragmentShader!)
  gl.linkProgram(program!)
  if (!gl.getProgramParameter(program!, gl.LINK_STATUS)) {
    const error = new Error(
      `Failed to create Stage: failed to link Shader Program. Details:\n${gl.getProgramInfoLog(
        program!
      )}`
    )
    dispose()

    return error
  }

  gl.useProgram(program)

  for (const [attributeName, attributeConfig] of attributes.entries()) {
    const attributeBuffer = gl.createBuffer()
    attributeConfig.usage = attributeConfig.usage ?? 'DYNAMIC_DRAW'
    gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, attributeConfig.data, gl[attributeConfig.usage])

    const attributeLocation = gl.getAttribLocation(program!, attributeName as string)
    attributeInfo.set(attributeName, { buffer: attributeBuffer!, location: attributeLocation })

    if (attributeLocation !== -1) {
      gl.enableVertexAttribArray(attributeLocation)
    }
  }

  for (const [uniformName, uniformConfig] of uniforms.entries()) {
    const uniformLocation = gl.getUniformLocation(program!, uniformName as string)

    uniformLocations.set(uniformName, uniformLocation)

    if (
      uniformConfig.type === 'mat2' ||
      uniformConfig.type === 'mat3' ||
      uniformConfig.type === 'mat4'
    ) {
      gl[stageUniformTypeToGLMethod[uniformConfig.type]](uniformLocation, false, uniformConfig.data)
    } else {
      gl[stageUniformTypeToGLMethod[uniformConfig.type]](
        uniformLocation,
        uniformConfig.data as number[]
      )
    }
  }

  const elements = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, config.elements.data, gl.STATIC_DRAW)

  const setAttribute = <TAttribute extends keyof TAttributes>(
    attribute: TAttribute,
    data: TAttributes[TAttribute]['data']
  ) => {
    const previous = config.attributes[attribute].data

    const { buffer } = attributeInfo.get(attribute)!

    config.attributes[attribute].data = data

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl[config.attributes[attribute].usage!])

    emitter.emit('update:attribute', { attribute, value: data, previous })
  }

  const setUniform = <TUniform extends keyof TUniforms>(
    uniform: TUniform,
    data: TUniforms[TUniform]['data']
  ) => {
    const previous = config.uniforms[uniform].data

    const location = uniformLocations.get(uniform)!
    const uniformConfig = uniforms.get(uniform)!

    config.uniforms[uniform].data = data

    if (
      uniformConfig.type === 'mat2' ||
      uniformConfig.type === 'mat3' ||
      uniformConfig.type === 'mat4'
    ) {
      gl[stageUniformTypeToGLMethod[uniformConfig.type]](location, false, uniformConfig.data)
    } else {
      gl[stageUniformTypeToGLMethod[uniformConfig.type]](location, uniformConfig.data as number[])
    }

    emitter.emit('update:uniform', { uniform, value: data, previous })
  }

  const resize = (width: number, height: number) => {
    const pixelRatio = config.maxPixelRatio
      ? Math.min(config.maxPixelRatio, window.devicePixelRatio)
      : window.devicePixelRatio

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio

    gl.viewport(0, 0, canvas.width, canvas.height)

    emitter.emit('resize', { width, height, pixelRatio })
  }

  if (config.observeResize) {
    const debouncedResize = debounce(resize, 32, { trailing: true })
    resizeObserver = new ResizeObserver(([entry]) => {
      debouncedResize(entry.contentRect.width, entry.contentRect.height)
    })
    resizeObserver.observe(canvas)
  }

  const rect = canvas.getBoundingClientRect()
  resize(rect.width, rect.height)

  config.elements.mode = config.elements.mode ?? 'TRIANGLES'

  const render = () => {
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    for (const [attributeName, attributeConfig] of attributes.entries()) {
      const { buffer, location } = attributeInfo.get(attributeName)!
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.vertexAttribPointer(location, attributeConfig.size, gl.FLOAT, false, 0, 0)
    }

    emitter.emit('render', gl)

    gl.drawElements(
      gl[config.elements.mode!],
      config.elements.data.length,
      gl[config.elements.type],
      0
    )
  }

  const { emit, ...emitterAPI } = emitter

  return {
    canvas,
    attributes: config.attributes,
    uniforms: config.uniforms,
    elements: config.elements,
    vertexShader: config.vertexShader,
    fragmentShader: config.fragmentShader,
    gl,

    resize,
    setAttribute,
    setUniform,
    render,
    dispose,

    ...emitterAPI,
  }
}
