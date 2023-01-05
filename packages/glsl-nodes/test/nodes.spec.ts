import { describe, test } from 'vitest'
import { createProgram } from '../src/createProgram'
import { attribute, uniform } from '../src/nodes/data'
import { add } from '../src/nodes/math'
import { output } from '../src/nodes/outputs'

describe('nodes', () => {
  test('it works', ({ expect }) => {
    expect(2).toBe(2)

    createProgram((namer) => {
      // const white = constant('vec4', )
      const position = attribute('vec4', namer.attribute('position'))
      const offset = uniform('vec4', namer.attribute('offset'))

      const positionAndOffset = add(position, offset)

      return {
        gl_FragColor: output('gl_FragColor', offset),
        gl_Position: output('gl_Position', positionAndOffset)
      }
    })
  })
})
