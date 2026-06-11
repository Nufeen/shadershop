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
      let texture
      let traceBuffer
      let pendingExport = null
      let pendingSnapshot = false
      let dragOnCanvas = false

      const fitSize = () => {
        const cw = Math.max(1, container.clientWidth)
        const ch = Math.max(1, container.clientHeight)
        if (!texture) return [cw, ch]
        const scale = Math.min(1, cw / texture.width, ch / texture.height)
        return [
          Math.max(1, Math.floor(texture.width * scale)),
          Math.max(1, Math.floor(texture.height * scale)),
        ]
      }

      p.setup = () => {
        const [w, h] = fitSize()
        p.createCanvas(w, h, p.WEBGL)
        p.noStroke()
        shader = p.createShader(vertSrc, fragSrc)

        traceBuffer = p.createGraphics(w, h)
        traceBuffer.background(0)
      }

      p.draw = () => {
        if (!texture) {
          p.background(26)
          return
        }
        p.shader(shader)

        if (p.mouseIsPressed) {
          traceBuffer.noStroke()
          traceBuffer.fill(255)
          traceBuffer.ellipse(p.mouseX, p.mouseY, 30, 30)
        }

        shader.setUniform('uResolution', [p.width, p.height])
        shader.setUniform('uTime', p.millis() / 1000)
        shader.setUniform('uBlurRadius', 0.01)
        shader.setUniform('uTexture', texture)
        shader.setUniform('uTraceTexture', traceBuffer)
        shader.setUniform('uMouse', [p.mouseX / p.width, p.mouseY / p.height])
        shader.setUniform('uMousePressed', p.mouseIsPressed ? 1.0 : 0.0)
        p.rect(0, 0, p.width, p.height)

        if (pendingSnapshot) {
          pendingSnapshot = false
          const off = document.createElement('canvas')
          off.width = p.width
          off.height = p.height
          off.getContext('2d').drawImage(p.canvas, 0, 0, off.width, off.height)
          const dataURL = off.toDataURL('image/png')
          window.dispatchEvent(
            new CustomEvent('shadershop:edit-captured', { detail: { dataURL } }),
          )
        }

        if (pendingExport) {
          const { filename, format } = pendingExport
          pendingExport = null
          p.saveCanvas(filename, format)
        }
      }

      p.mousePressed = () => {
        if (!texture) {
          dragOnCanvas = false
          return
        }
        const x = p.mouseX
        const y = p.mouseY
        dragOnCanvas = x >= 0 && x < p.width && y >= 0 && y < p.height
      }

      p.mouseReleased = () => {
        if (texture && dragOnCanvas) pendingSnapshot = true
        dragOnCanvas = false
      }

      p.windowResized = () => {
        const [w, h] = fitSize()
        p.resizeCanvas(w, h)
      }

      p.requestExport = (filename = 'shadershop', format = 'png') => {
        pendingExport = { filename, format }
        p.redraw()
      }

      p.requestLoad = (url, opts = {}) => {
        const asOriginal = opts.asOriginal !== false
        p.loadImage(
          url,
          (img) => {
            texture = img
            const [w, h] = fitSize()
            p.resizeCanvas(w, h)
            traceBuffer = p.createGraphics(w, h)
            traceBuffer.background(0)
            URL.revokeObjectURL(url)
            if (asOriginal) {
              const dataURL = img.canvas.toDataURL('image/png')
              window.dispatchEvent(
                new CustomEvent('shadershop:original-loaded', { detail: { dataURL } }),
              )
            }
          },
          () => URL.revokeObjectURL(url),
        )
      }
    }

    const instance = new p5(sketch, container)

    const onExport = (e) => {
      const { filename, format } = e.detail || {}
      instance.requestExport?.(filename, format)
    }
    const onLoad = (e) => {
      const { url, asOriginal } = e.detail || {}
      if (url) instance.requestLoad?.(url, { asOriginal })
    }
    window.addEventListener('shadershop:export', onExport)
    window.addEventListener('shadershop:load', onLoad)

    const ro = new ResizeObserver(() => {
      if (instance.windowResized) instance.windowResized()
    })
    ro.observe(container)

    return () => {
      window.removeEventListener('shadershop:export', onExport)
      window.removeEventListener('shadershop:load', onLoad)
      ro.disconnect()
      instance.remove()
    }
  }, [])

  return <main className="canvas" ref={containerRef} />
}
