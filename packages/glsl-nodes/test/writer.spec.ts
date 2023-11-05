import { describe, test } from 'vitest'
import { outdent } from 'outdent'
import { createWriter } from '../src/writer'

describe('writer', () => {
  test('it writes', ({ expect }) => {
    const vertexWriter = createWriter('vertex')
    const fragmentWriter = createWriter('fragment')

    fragmentWriter.addMainBody(`gl_FragColor = vec4(v_uv, 0.5, 1.0);`)

    vertexWriter.addMainBody(`v_uv = a_uv;`)
    vertexWriter.addMainBody(`gl_Position = vec4(a_pos, 1.0);`)

    fragmentWriter.addGlobal(`varying vec2 v_uv;`)

    vertexWriter.addGlobal(`varying vec2 v_uv;`)
    vertexWriter.addGlobal(`attribute vec2 a_uv;`)
    vertexWriter.addGlobal(`attribute vec3 a_pos;`)

    const vertexShader = vertexWriter.compile()
    const fragmentShader = fragmentWriter.compile()

    expect(vertexShader).toBe(outdent`
        attribute vec3 a_pos;
        attribute vec2 a_uv;
        varying vec2 v_uv;
        void main() {
        gl_Position = vec4(a_pos, 1.0);
        v_uv = a_uv;
        }
      `)
    expect(fragmentShader).toBe(outdent`
        varying vec2 v_uv;
        void main() {
        gl_FragColor = vec4(v_uv, 0.5, 1.0);
        }
      `)
  })
})
