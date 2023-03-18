/* eslint-disable no-console */
import { describe, test } from 'vitest'
import { createProgram } from '../src/createProgram'
import {
  attribute,
  constant,
  literal,
  output,
  swizzle,
  variable,
  pow,
  multiply,
  add,
  unfiormArray,
  dot,
} from '../src'
import { cast } from '../src/nodes/data'
import { accessArray } from '../src/nodes'

describe('nodes', () => {
  test('it works', ({ expect }) => {
    expect(2).toBe(2)

    const controlPointCount = { x: 3, y: 3 }

    const { vertex, fragment } = createProgram((namer) => {
      const controlPointPositions = unfiormArray(
        'vec2',
        namer.uniform('controlPoints'),
        controlPointCount.x * controlPointCount.y
      )
      const controlPointStartIndex = attribute('float', namer.attribute('controlPointStartIndex'))

      const idenmat = constant('mat4', namer.constant('idenmat'), literal('mat4', ['1.0']))

      const t = attribute('vec2', namer.attribute('t'))

      const tX = swizzle(t, 'x')
      const tY = swizzle(t, 'y')

      const cpStart = variable(
        'int',
        namer.variable('cpStart'),
        cast(controlPointStartIndex, 'int')
      )

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
        namer.variable('bern_y'),
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

      const createInterP = (axis: 'x' | 'y') =>
        variable('vec4', namer.variable(`interP${axis.toUpperCase()}`), [
          dot(
            bernX,
            literal('vec4', [
              swizzle(accessArray(controlPointPositions, cpStart), axis),
              swizzle(
                accessArray(controlPointPositions, add(cpStart, literal('int', ['1']))),
                axis
              ),
              swizzle(
                accessArray(controlPointPositions, add(cpStart, literal('int', ['2']))),
                axis
              ),
              swizzle(
                accessArray(controlPointPositions, add(cpStart, literal('int', ['3']))),
                axis
              ),
            ])
          ),
          dot(
            bernX,
            literal('vec4', [
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x + 1}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x + 2}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x + 3}`]))
                ),
                axis
              ),
            ])
          ),
          dot(
            bernX,
            literal('vec4', [
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 2}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 2 + 1}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 2 + 2}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 2 + 3}`]))
                ),
                axis
              ),
            ])
          ),
          dot(
            bernX,
            literal('vec4', [
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 3}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 3 + 1}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 3 + 2}`]))
                ),
                axis
              ),
              swizzle(
                accessArray(
                  controlPointPositions,
                  add(cpStart, literal('int', [`${controlPointCount.x * 3 + 3}`]))
                ),
                axis
              ),
            ])
          ),
        ])

      const interPX = createInterP('x')
      const interPY = createInterP('y')

      return {
        gl_FragColor: output('gl_FragColor', literal('vec4', ['1.0', '1.0', '1.0', '1.0'])),
        gl_Position: output(
          'gl_Position',
          literal('vec4', [dot(bernY, interPX), dot(bernY, interPY), '0.0', '1.0'])
        ),
      }
    })

    console.log(vertex)
    console.log()
    console.log(fragment)
  })
})
