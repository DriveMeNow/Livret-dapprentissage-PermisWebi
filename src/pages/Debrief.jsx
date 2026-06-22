// Onglet 5 — Débrief post-séance
// TON : Permis Webi — chaleureux, tutoiement, 3 questions guidées

import { useState, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// ── Hook micro vocal (Web Speech API) — identique à Seances.jsx ──────
function useMicro() {
  const [ecoute, setEcoute] = useState(false)
  const refReco = useRef(null)
  const supporte = !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition))

  const demarrer = (onResultat) => {
    if (!supporte) {
      alert('La commande vocale n\'est pas disponible sur ce navigateur. Essaie avec Chrome.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r = new SR()
    refReco.current = r
    r.lang = 'fr-FR'
    r.continuous = false
    r.interimResults = false
    r.onresult = (e) => {
      const texte = e.results[0][0].transcript
      onResultat(texte)
      setEcoute(false)
    }
    r.onerror = () => setEcoute(false)
    r.onend = () => setEcoute(false)
    r.start()
    setEcoute(true)
  }

  const arreter = () => {
    refReco.current?.stop()
    setEcoute(false)
  }

  return { ecoute, supporte, demarrer, arreter }
}

const QUESTIONS = [
  {
    id: 'ressenti',
    emoji: '🌡️',
    titre: 'Ressenti global',
    question: 'Comment tu t\'es senti(e) au volant aujourd\'hui ?',
    placeholder: 'Ex : j\'étais stressé(e) au départ mais plus à l\'aise sur la fin, j\'ai bien géré le rond-point…',
  },
  {
    id: 'technique',
    emoji: '🔧',
    titre: 'Analyse technique',
    question: 'Qu\'est-ce qui t\'a semblé difficile ? Qu\'est-ce qui s\'est bien passé ?',
    placeholder: 'Ex : le créneau m\'échappe encore, mais j\'ai bien anticipé le passage piéton rue de la Paix…',
  },
  {
    id: 'autonomie',
    emoji: '🎯',
    titre: 'Autonomie & suite',
    question: 'Sur quoi tu veux te concentrer à la prochaine séance ?',
    placeholder: 'Ex : je veux retravailler la vitesse en virage et essayer la voie rapide…',
  },
]

export default function Debrief() {
  const [notes, setNotes] = useLocalStorage('pw_debrief', {})
  const micro = useMicro()

  const handleChange = (id, value) => {
    setNotes(prev => ({ ...prev, [id]: value }))
  }

  /** Bouton micro — ajoute le texte reconnu à la fin du champ */
  const BoutonMicro = ({ champKey }) => {
    const actif = micro.ecoute
    if (!micro.supporte) return null
    return (
      <button
        type="button"
        onClick={() =>
          actif
            ? micro.arreter()
            : micro.demarrer(texte =>
                setNotes(prev => ({ ...prev, [champKey]: (prev[champKey] ? prev[champKey] + ' ' : '') + texte }))
              )
        }
        className="absolute right-2 top-2 w-7 h-7 rounded-full flex items-center justify-center text-base transition-all tap-scale"
        style={{
          background: actif ? 'rgba(239,68,68,0.25)' : 'rgba(181,134,60,0.12)',
          border: `1px solid ${actif ? 'rgba(239,68,68,0.6)' : 'rgba(181,134,60,0.35)'}`,
        }}
        title={actif ? 'Arrêter l\'écoute' : 'Dicter ce champ'}
      >
        {actif ? '⏹' : '🎤'}
      </button>
    )
  }

  const rempli = QUESTIONS.filter(q => notes[q.id]?.trim()).length

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="text-center mb-5">
        <h1 className="text-xl font-extrabold text-pw-ink">Mon débrief</h1>
        <p className="text-xs text-pw-ink mt-1">3 questions pour progresser à chaque séance</p>
      </div>

      {/* Indicateur de complétion */}
      {rempli > 0 && (
        <div className="mb-4 px-4 py-2.5 rounded-xl flex items-center gap-3"
             style={{ background: 'rgba(181,134,60,0.08)', border: '1px solid rgba(181,134,60,0.2)' }}>
          <span className="text-lg">✍️</span>
          <p className="text-xs text-pw-ink">
            <span className="font-bold" style={{ color: '#B5863C' }}>{rempli}/3</span> question{rempli > 1 ? 's' : ''} remplie{rempli > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Questions guidées */}
      {QUESTIONS.map((q, i) => (
        <div key={q.id} className="rounded-2xl p-4 mb-4"
             style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>

          {/* Header question */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center text-base"
                 style={{ background: 'rgba(181,134,60,0.12)', border: '1px solid rgba(181,134,60,0.25)' }}>
              {q.emoji}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5" style={{ color: '#B5863C' }}>
                Question {i + 1} — {q.titre}
              </p>
              <p className="text-sm font-semibold text-pw-ink leading-snug">{q.question}</p>
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="relative">
            <textarea
              rows={4}
              placeholder={micro.supporte ? q.placeholder + ' (ou dicte avec le micro 🎤)' : q.placeholder}
              value={notes[q.id] || ''}
              onChange={e => handleChange(q.id, e.target.value)}
              className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/20 outline-none resize-none leading-relaxed"
              style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid rgba(33,28,22,0.10)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.10)'}
            />
            <BoutonMicro champKey={q.id} />
          </div>
        </div>
      ))}

      {/* Note libre */}
      <div className="rounded-2xl p-4 mb-4"
           style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center text-base"
               style={{ background: 'rgba(33,28,22,0.06)' }}>
            📋
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5 text-pw-ink">Notes libres</p>
            <p className="text-sm font-semibold text-pw-ink leading-snug">Tout ce que tu veux noter en plus</p>
          </div>
        </div>
        <div className="relative">
          <textarea
            rows={4}
            placeholder={micro.supporte ? 'Consignes de l\'accompagnateur, choses à retenir, liens utiles… (ou dicte avec le micro 🎤)' : 'Consignes de l\'accompagnateur, choses à retenir, liens utiles…'}
            value={notes['libre'] || ''}
            onChange={e => handleChange('libre', e.target.value)}
            className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/20 outline-none resize-none leading-relaxed"
            style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid rgba(33,28,22,0.10)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.10)'}
          />
          <BoutonMicro champKey="libre" />
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="text-center py-3 px-4 rounded-xl mb-2"
           style={{ background: 'rgba(181,134,60,0.06)', border: '1px solid rgba(181,134,60,0.15)' }}>
        <p className="text-xs text-pw-ink leading-relaxed">
          💡 <span className="text-pw-ink font-semibold">Astuce :</span> Remplis ce débrief juste après la séance, pendant que tout est encore frais. C'est ce qui fait vraiment progresser vite.
        </p>
      </div>

      {/* Note de sauvegarde */}
      <p className="text-center text-[10px] text-pw-ink-soft/25 mt-3 pb-2">
        Sauvegardé automatiquement sur ton téléphone
      </p>
    </div>
  )
}
