import { createPlaneGeometry, createStage } from '../src'

window.addEventListener(
  'load',
  () => {
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas')

    const { vertices, uvs, triangles } = createPlaneGeometry(2)

    const stage = createStage({
      canvas,
      attributes: {
        a_pos: {
          type: 'float',
          data: new Float32Array(vertices),
          usage: 'STATIC_DRAW',
          size: 2,
        },
        a_uv: {
          type: 'float',
          data: new Float32Array(uvs),
          usage: 'STATIC_DRAW',
          size: 2,
        },
      },
      uniforms: {},
      vertexShader: `
        attribute vec2 a_pos;
        attribute vec2 a_uv;

        varying vec2 v_uv;

        void main() {
          gl_Position = vec4(a_pos, 0.0, 1.0);
          v_uv = a_uv;
        }
      `,
      fragmentShader: `
        precision mediump float;

        varying vec2 v_uv;

        void main() {
          gl_FragColor = vec4(v_uv, 0.0, 1.0);
        }
      `,
      elements: {
        type: 'UNSIGNED_SHORT',
        data: new Uint16Array(triangles),
        mode: 'TRIANGLES',
      },
      maxPixelRatio: 2,
      observeResize: true,
    })

    if (stage instanceof Error) {
      throw stage
    }

    stage.on('render', (gl) => {
      // eslint-disable-next-line no-console
      console.log(gl)
    })
    stage.on('resize', data => {
      // eslint-disable-next-line no-console
      console.log(data)
    })

    stage.render()
  },
  { capture: false }
)
