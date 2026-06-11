import { useEffect, useRef } from 'react'
import p5 from 'p5'
import vertSrc from '../shaders/basic.vert?raw'
import fragSrc from '../shaders/blur.glsl?raw'

export default function Canvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    const sketch = (p) => {
      let shader

      const sizeFromContainer = () => {
        const w = Math.max(1, container.clientWidth)
        const h = Math.max(1, container.clientHeight)
        return [w, h]
      }

      p.setup = () => {
        const [w, h] = sizeFromContainer()
        p.createCanvas(w, h, p.WEBGL)
        p.noStroke()
        shader = p.createShader(vertSrc, fragSrc)
        p.shader(shader)
      }

      p.draw = () => {
        shader.setUniform('uResolution', [p.width, p.height])
        shader.setUniform('uTime', p.millis() / 1000)
        shader.setUniform('uBlurRadius', 0.01)
        p.rect(0, 0, p.width, p.height)
      }

      p.windowResized = () => {
        const [w, h] = sizeFromContainer()
        p.resizeCanvas(w, h)
      }
    }

    const instance = new p5(sketch, container)

    const ro = new ResizeObserver(() => instance.windowResized())
    ro.observe(container)

    return () => {
      ro.disconnect()
      instance.remove()
    }
  }, [])

  return <main className="canvas" ref={containerRef} />
}
