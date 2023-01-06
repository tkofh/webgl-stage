/* eslint-disable no-console */
import { describe, test } from 'vitest'
import { createProgram } from '../src/createProgram'
import { attribute, constant, literal, output, swizzle, variable, pow, multiply, add } from '../src'

describe('nodes', () => {
  test('it works', ({ expect }) => {
    expect(2).toBe(2)

    const { vertex, fragment } = createProgram((namer) => {
      const white = constant(
        'vec3',
        namer.constant('white'),
        literal('vec3', ['1.0', '1.0', '1.0'])
      )

      const t = attribute('vec2', namer.attribute('t'))

      const tX = swizzle(t, 'x')
      const tY = swizzle(t, 'y')

      const idenmat = constant('mat4', namer.constant('idenmat'), literal('mat4', ['1.0']))
      const bernX = variable(
        'vec4',
        namer.variable('bern_x'),
        multiply(
          literal('vec4', [
            '1.0',
            tX,
            pow(tX, literal('float', ['2.0'])),
            pow(tX, literal('float', ['3.0'])),
          ]),
          idenmat
        )
      )
      const bernY = variable(
        'vec4',
        namer.variable('bern_x'),
        multiply(
          literal('vec4', [
            '1.0',
            tY,
            pow(tY, literal('float', ['2.0'])),
            pow(tY, literal('float', ['3.0'])),
          ]),
          idenmat
        )
      )

      return {
        gl_FragColor: output('gl_FragColor', literal('vec4', [swizzle(white, 'xxy'), '1.0'])),
        gl_Position: output('gl_Position', add(bernX, bernY)),
      }
    })

    console.log(vertex)
    console.log()
    console.log(fragment)
  })
})
