import { useEffect, useRef } from 'react'
import p5 from 'p5'
import vertSrc from '../shaders/basic.vert?raw'
import fragSrc from '../shaders/blur.glsl?raw'
import textureUrl from '../mock/1.png'

export default function Canvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    const sketch = (p) => {
      let shader
      let texture

      const fitSize = () => {
        const cw = Math.max(1, container.clientWidth)
        const ch = Math.max(1, container.clientHeight)
        const scale = Math.min(1, cw / texture.width, ch / texture.height)
        return [
          Math.max(1, Math.floor(texture.width * scale)),
          Math.max(1, Math.floor(texture.height * scale)),
        ]
      }

      p.preload = () => {
        texture = p.loadImage(textureUrl)
      }

      p.setup = () => {
        const [w, h] = fitSize()
        p.createCanvas(w, h, p.WEBGL)
        p.noStroke()
        shader = p.createShader(vertSrc, fragSrc)
        p.shader(shader)
      }

      p.draw = () => {
        shader.setUniform('uResolution', [p.width, p.height])
        shader.setUniform('uTime', p.millis() / 1000)
        shader.setUniform('uBlurRadius', 0.01)
        shader.setUniform('uTexture', texture)
        p.rect(0, 0, p.width, p.height)
      }

      p.windowResized = () => {
        const [w, h] = fitSize()
        p.resizeCanvas(w, h)
      }
    }

    const instance = new p5(sketch, container)

    const ro = new ResizeObserver(() => {
      if (instance.windowResized) instance.windowResized()
    })
    ro.observe(container)

    return () => {
      ro.disconnect()
      instance.remove()
    }
  }, [])

  return <main className="canvas" ref={containerRef} />
}
