// Composant signature numérique — tactile (mobile) + souris (desktop)
import { useRef, useEffect, useState } from 'react'

export default function SignatureCanvas({ onChange, value }) {
  const canvasRef = useRef()
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(!value)
  const lastPos = useRef(null)

  // Charger une signature existante
  useEffect(() => {
    if (value && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = value
      setIsEmpty(false)
    }
  }, [])

  // Taille réelle du canvas vs taille CSS (pour le scaling)
  const getScale = () => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return { x: canvas.width / rect.width, y: canvas.height / rect.height }
  }

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scale = getScale()
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scale.x,
        y: (e.touches[0].clientY - rect.top) * scale.y,
      }
    }
    return {
      x: (e.clientX - rect.left) * scale.x,
      y: (e.clientY - rect.top) * scale.y,
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    setIsEmpty(false)
    lastPos.current = getPos(e)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing || !lastPos.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e)
    ctx.strokeStyle = '#211C16'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const stopDrawing = (e) => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPos.current = null
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'))
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    onChange(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wide text-pw-ink">
          Signature de l'accompagnateur·rice
        </label>
        {!isEmpty && (
          <button onClick={clear}
                  className="text-[10px] text-pw-ink-soft/35 hover:text-pw-ink transition-colors">
            Effacer
          </button>
        )}
      </div>
      <div className="relative rounded-xl overflow-hidden"
           style={{ border: `1px solid ${isEmpty ? 'rgba(33,28,22,0.12)' : 'rgba(181,134,60,0.4)'}`, background: 'rgba(33,28,22,0.03)', transition: 'border-color 0.2s' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full touch-none block"
          style={{ cursor: 'crosshair', maxHeight: '100px' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-pw-ink-soft/25">✍️ L'accompagnateur·rice signe ici avec son doigt</p>
          </div>
        )}
      </div>
      <p className="text-[10px] text-pw-ink-soft/30 mt-1">
        La signature est enregistrée et ne peut pas être modifiée après validation
      </p>
    </div>
  )
}
