/**
 * Onglet Séances — V1.4
 * - Auto-advance HH → MM (focus automatique après 2 chiffres)
 * - Note /10 + emoji pour "Comment tu t'es senti·e au volant ?"
 * - Micro vocal (Web Speech API) sur les champs de débrief
 * - "SÉLECTIONNER ou AJOUTER" sur le dropdown accompagnateur
 * - Multi-villes avec tags (champ texte + bouton +)
 */
import { useState, useMemo, useRef, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, COULEURS, ETATS_PW } from '../data/competences-pw'
import SignatureCanvas from '../components/SignatureCanvas'
import { CarreEtat } from './Competences'

// ── Emojis et couleurs pour la note /10 ──────────────────────────────
const NOTE_CONFIG = [
  null,
  { emoji: '😭', color: '#ef4444' },
  { emoji: '😢', color: '#f87171' },
  { emoji: '😟', color: '#f97316' },
  { emoji: '😕', color: '#fb923c' },
  { emoji: '😐', color: '#eab308' },
  { emoji: '🙂', color: '#a3e635' },
  { emoji: '😊', color: '#84cc16' },
  { emoji: '😄', color: '#4ade80' },
  { emoji: '😃', color: '#22c55e' },
  { emoji: '🤩', color: '#10b981' },
]

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function dureeSeance(s) {
  if (!s.heureDebut || !s.heureFin) return null
  const [h1, m1] = s.heureDebut.split(':').map(Number)
  const [h2, m2] = s.heureFin.split(':').map(Number)
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (mins <= 0) return null
  return mins >= 60 ? `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}` : `${mins} min`
}

function newSeance() {
  return {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    heureDebut: '', heureFin: '', km: '',
    villes: [],           // multi-villes sous forme de tableau
    competencesEvaluees: {},
    accompagnateur: { nom: '', prenom: '', numeroPermis: '' },
    signature: null,
    notes: '',
    noteVolant: 0,        // 0 = non renseigné, 1-10
    debriefRessenti: '', debriefTechnique: '', debriefSuite: '',
    cepc: null,           // résultat examen blanc { date, bilan, total, obs, ts }
  }
}

/** Validation format permis de conduire français */
function validerPermis(num) {
  if (!num) return null
  const n = num.replace(/[\s\-\.]/g, '').toUpperCase()
  if (n.length < 8) return null
  if (n.length > 15) return false
  if (!/^[A-Z0-9]+$/.test(n)) return false
  if (!/\d/.test(n)) return false
  return true
}

// ── Hook micro vocal (Web Speech API) ────────────────────────────────
function useMicro() {
  const [ecoute, setEcoute] = useState(false)
  const refReco = useRef(null)
  const supporte = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

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

/**
 * Saisie heure numérique — clavier natif, auto-passage HH → MM
 */
function SaisieHeure({ label, value, onChange }) {
  const parts = (value || '').split(':')
  const hVal = parts[0] || ''
  const mVal = parts[1] || ''
  const refM = useRef(null)

  const updateH = (raw) => {
    if (raw === '' || raw === null) {
      onChange(mVal ? `00:${mVal}` : '')
      return
    }
    const n = parseInt(raw, 10)
    if (isNaN(n)) return
    const h = String(Math.min(23, Math.max(0, n))).padStart(2, '0')
    onChange(`${h}:${mVal || '00'}`)
    // Auto-advance : 2 chiffres saisis OU premier chiffre > 2 (ex : 3,4…9)
    if (raw.length >= 2 || (raw.length === 1 && n > 2)) {
      setTimeout(() => refM.current?.focus(), 30)
    }
  }

  const updateM = (raw) => {
    if (raw === '' || raw === null) {
      onChange(hVal ? `${hVal}:00` : '')
      return
    }
    const n = parseInt(raw, 10)
    if (isNaN(n)) return
    const m = String(Math.min(59, Math.max(0, n))).padStart(2, '0')
    onChange(`${hVal || '00'}:${m}`)
  }

  const iStyle = {
    background: 'rgba(33,28,22,0.07)',
    border: '1px solid rgba(33,28,22,0.12)',
    colorScheme: 'dark',
  }

  return (
    <div className="mb-3">
      <label className="text-xs font-bold uppercase tracking-wide text-pw-ink mb-1.5 block">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="number" inputMode="numeric" min="0" max="23" placeholder="HH"
          value={hVal}
          onChange={e => updateH(e.target.value)}
          className="flex-1 px-2 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none text-center"
          style={iStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'}
        />
        <span className="text-pw-ink font-bold text-xl leading-none">:</span>
        <input
          ref={refM}
          type="number" inputMode="numeric" min="0" max="59" placeholder="MM"
          value={mVal}
          onChange={e => updateM(e.target.value)}
          className="flex-1 px-2 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none text-center"
          style={iStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'}
        />
      </div>
    </div>
  )
}

/**
 * Saisie multi-villes avec tags
 */
function VillesTags({ villes = [], onChange }) {
  const [input, setInput] = useState('')
  const refInput = useRef(null)

  const ajouter = () => {
    const v = input.trim()
    if (!v) return
    if (!villes.includes(v)) onChange([...villes, v])
    setInput('')
    refInput.current?.focus()
  }

  const retirer = (i) => onChange(villes.filter((_, idx) => idx !== i))

  return (
    <div>
      {villes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {villes.map((v, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(181,134,60,0.12)', border: '1px solid rgba(181,134,60,0.35)', color: '#B5863C' }}>
              📍 {v}
              <button onClick={() => retirer(i)}
                      className="ml-0.5 font-bold leading-none"
                      style={{ color: 'rgba(181,134,60,0.7)' }}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={refInput}
          type="text" placeholder="Paris 15e, Versailles…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); ajouter() } }}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none"
          style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'}
        />
        <button
          onClick={ajouter}
          className="px-3 py-2.5 rounded-xl font-bold text-base tap-scale"
          style={{ background: 'rgba(181,134,60,0.15)', border: '1px solid rgba(181,134,60,0.4)', color: '#B5863C' }}
        >
          +
        </button>
      </div>
      <p className="text-[9px] text-pw-ink-soft/35 mt-1">Tape une ville puis appuie sur + pour en ajouter plusieurs</p>
    </div>
  )
}

export default function Seances({ ouvrirForm }) {
  const [seances, setSeances] = useLocalStorage('pw_seances', [])
  const [etatsGlobal, setEtatsGlobal] = useLocalStorage('pw_competences', {})
  const [vue, setVue] = useState(ouvrirForm ? 'form' : 'liste')
  const [etapeForm, setEtapeForm] = useState(1)
  const [groupeActifSeance, setGroupeActifSeance] = useState(null)
  const [modeSeance, setModeSeance] = useState('normal') // 'normal' | 'cepc'
  const [cepcOuvert, setCepcOuvert] = useState(false)
  const micro = useMicro()

  /** Accompagnateurs uniques déjà utilisés (max 5, triés du plus récent) */
  const accompagnateursRecents = useMemo(() => {
    const seen = new Set()
    return seances
      .filter(s => s.accompagnateur?.nom)
      .reduce((acc, s) => {
        const key = `${s.accompagnateur.prenom}|${s.accompagnateur.nom}`
        if (!seen.has(key)) {
          seen.add(key)
          acc.push({ ...s.accompagnateur })
        }
        return acc
      }, [])
      .slice(0, 5)
  }, [seances])

  /** Initialise une nouvelle séance avec le dernier accompagnateur pré-rempli */
  const initSeance = () => {
    const base = newSeance()
    const dernAccomp = seances.length > 0 ? seances[0].accompagnateur : null
    if (dernAccomp?.nom) base.accompagnateur = { ...dernAccomp }
    return base
  }

  const [draft, setDraft] = useState(() => ouvrirForm ? initSeance() : newSeance())

  const handleSave = () => {
    if (!draft.date) return
    setSeances(prev => [draft, ...prev])
    if (Object.keys(draft.competencesEvaluees).length > 0) {
      setEtatsGlobal(prev => {
        const next = { ...prev }
        Object.entries(draft.competencesEvaluees).forEach(([id, val]) => {
          if ((val || 0) > (next[id] || 0)) next[id] = val
        })
        return next
      })
    }
    setDraft(newSeance())
    setEtapeForm(1)
    setGroupeActifSeance(null)
    setModeSeance('normal')
    setVue('liste')
  }

  const setEtatSc = (id, val) => {
    setDraft(d => ({ ...d, competencesEvaluees: { ...d.competencesEvaluees, [id]: val } }))
  }
  const setAccomp = (champ, val) => {
    setDraft(d => ({ ...d, accompagnateur: { ...d.accompagnateur, [champ]: val } }))
  }
  const handleDelete = (id) => setSeances(prev => prev.filter(s => s.id !== id))

  /** Valeur du select accompagnateur (index ou 'autre' ou '') */
  const accompSelectValue = useMemo(() => {
    const { nom, prenom } = draft.accompagnateur
    if (!nom && !prenom) return ''
    const idx = accompagnateursRecents.findIndex(a => a.nom === nom && a.prenom === prenom)
    return idx >= 0 ? String(idx) : 'autre'
  }, [draft.accompagnateur, accompagnateursRecents])

  const handleSelectAccomp = (e) => {
    const val = e.target.value
    if (val === '' || val === 'autre') {
      setDraft(d => ({ ...d, accompagnateur: { nom: '', prenom: '', numeroPermis: '' } }))
    } else {
      const idx = parseInt(val, 10)
      if (!isNaN(idx) && accompagnateursRecents[idx]) {
        setDraft(d => ({ ...d, accompagnateur: { ...accompagnateursRecents[idx] } }))
      }
    }
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
                setDraft(d => ({ ...d, [champKey]: (d[champKey] ? d[champKey] + ' ' : '') + texte }))
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

  const totalSeances = seances.length
  const totalKm = seances.reduce((s, x) => s + (parseInt(x.km) || 0), 0)

  // ── Étape 2 : vignettes groupes ou sous-compétences ───────
  const renderEtape2 = () => {
    if (groupeActifSeance) {
      const groupe = COMPETENCES_PW.find(g => g.id === groupeActifSeance)
      const c = COULEURS[groupe.couleur]
      return (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setGroupeActifSeance(null)}
                    className="text-sm font-semibold shrink-0" style={{ color: '#211C16' }}>
              ← Retour
            </button>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-pw-cream"
                    style={{ background: c.solid }}>{groupe.id}</span>
              <span className="text-base">{groupe.emoji}</span>
              <p className="text-sm font-extrabold text-pw-ink">{groupe.titre}</p>
            </div>
          </div>
          <div className="flex gap-3 mb-3 flex-wrap">
            {Object.entries(ETATS_PW).filter(([k]) => k !== '0').map(([niveau, e]) => (
              <div key={niveau} className="flex items-center gap-1.5">
                <CarreEtat etat={parseInt(niveau)} size="sm" />
                <span className="text-[10px] text-pw-ink">{e.label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 max-h-[45vh] overflow-y-auto scrollbar-thin pr-1">
            {groupe.sousCompetences.map(sc => {
              const etatSeance = draft.competencesEvaluees[sc.id] ?? 0
              return (
                <div key={sc.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                     style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.07)' }}>
                  <button onClick={() => setEtatSc(sc.id, (etatSeance + 1) % 4)}
                          className="shrink-0 transition-all active:scale-90">
                    <CarreEtat etat={etatSeance} size="md" />
                  </button>
                  <span className="text-xs text-pw-ink">{sc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2.5">
        <p className="text-[10px] text-pw-ink mb-2">
          Sélectionne un groupe pour évaluer les compétences travaillées.
        </p>
        {COMPETENCES_PW.map(g => {
          const nbEvalues = g.sousCompetences.filter(sc => (draft.competencesEvaluees[sc.id] || 0) > 0).length
          const c = COULEURS[g.couleur]
          return (
            <button key={g.id} onClick={() => setGroupeActifSeance(g.id)}
                    className="w-full rounded-2xl p-3.5 text-left tap-scale"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-pw-cream shrink-0"
                      style={{ background: c.solid }}>{g.id}</span>
                <span className="text-xl">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-pw-ink">{g.titre}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: c.text }}>
                    {nbEvalues > 0
                      ? `${nbEvalues} compétence${nbEvalues > 1 ? 's' : ''} évaluée${nbEvalues > 1 ? 's' : ''}`
                      : 'Appuyer pour évaluer →'}
                  </p>
                </div>
                {nbEvalues > 0 && (
                  <span className="text-base font-extrabold shrink-0" style={{ color: c.text }}>{nbEvalues}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  /** Ferme la modale CEPC et récupère le résultat depuis localStorage */
  const fermerCepc = () => {
    const raw = localStorage.getItem('cepc_dernier')
    if (raw) {
      try {        const parsed = JSON.parse(raw)
        setDraft(d => ({ ...d, cepc: parsed }))
      } catch (e) { /* ignore */ }
    }
    setCepcOuvert(false)
  }

  // Écoute le postMessage du CEPC (enregistrer → ferme automatiquement)
  const fermerCepcRef = useRef(fermerCepc)
  fermerCepcRef.current = fermerCepc
  useEffect(() => {
    if (!cepcOuvert) return
    const onMsg = (e) => {
      if (e.data?.type === 'cepc_saved') fermerCepcRef.current()
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [cepcOuvert])

  return (
    <>
    {/* ── Modale CEPC plein écran ─────────────────────────────────── */}
    {cepcOuvert && (
      <div className="fixed inset-0 z-[300] flex flex-col" style={{ background: '#f4f4f4' }}>
        {/* Barre de contrôle */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0"
             style={{ background: '#f8f2e5', borderBottom: '3px solid #B5863C' }}>
          <div>
            <p className="text-sm font-extrabold text-pw-ink">📋 Grille d'évaluation CEPC</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(181,134,60,0.75)' }}>
              Remplis la grille · clique 💾 Enregistrer · puis ferme
            </p>
          </div>
          <button
            onClick={fermerCepc}
            className="px-4 py-2 rounded-full text-xs font-extrabold tap-scale ml-3 shrink-0"
            style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}
          >
            ✓ Fermer
          </button>
        </div>
        {/* Iframe — fichier CEPC intact */}
        <iframe
          src="/cepc.html"
          className="flex-1 w-full border-none"
          title="Grille CEPC — Examen blanc"
        />
      </div>
    )}

    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* ── En-tête ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-pw-ink">
            {vue === 'form' ? 'Nouvelle séance' : 'Mes séances'}
          </h1>
          {vue === 'liste' && (
            <p className="text-xs text-pw-ink mt-0.5">
              {totalSeances} séance{totalSeances !== 1 ? 's' : ''} · {totalKm} km
            </p>
          )}
        </div>
        {vue === 'liste' ? (
          <button
            onClick={() => { setDraft(initSeance()); setEtapeForm(1); setGroupeActifSeance(null); setVue('form') }}
            className="px-4 py-2 rounded-full text-xs font-extrabold tap-scale"
            style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}
          >
            + Séance
          </button>
        ) : (
          <button onClick={() => { setVue('liste'); setEtapeForm(1); setGroupeActifSeance(null); setModeSeance('normal') }}
                  className="text-xs text-pw-ink hover:text-pw-ink transition-colors">
            Annuler
          </button>
        )}
      </div>

      {/* ── FORMULAIRE ──────────────────────────── */}
      {vue === 'form' && (
        <>
          {/* Indicateur d'étapes */}
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3].map(e => (
              <div key={e} className="flex-1 h-1 rounded-full transition-all"
                   style={{ background: e <= etapeForm ? '#B5863C' : 'rgba(33,28,22,0.12)' }} />
            ))}
          </div>

          {/* ── Étape 1 — Infos ───────────────── */}
          {etapeForm === 1 && (
            <div className="space-y-3">
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#B5863C' }}>
                  📅 Informations de la séance
                </p>
                <Champ label="Date">
                  <input type="date" value={draft.date}
                         onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
                         className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink outline-none"
                         style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)', colorScheme: 'dark' }}
                         onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
                         onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'} />
                </Champ>

                {/* Heures — auto-advance HH → MM */}
                <div className="grid grid-cols-2 gap-3">
                  <SaisieHeure label="Heure début" value={draft.heureDebut}
                               onChange={v => setDraft(d => ({ ...d, heureDebut: v }))} />
                  <SaisieHeure label="Heure fin" value={draft.heureFin}
                               onChange={v => setDraft(d => ({ ...d, heureFin: v }))} />
                </div>

                <Champ label="Km parcourus">
                  <input type="number" inputMode="numeric" placeholder="35"
                         value={draft.km}
                         onChange={e => setDraft(d => ({ ...d, km: e.target.value }))}
                         className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none"
                         style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)' }}
                         onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
                         onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'} />
                </Champ>

                {/* Multi-villes avec tags */}
                <Champ label="Ville(s) de conduite">
                  <VillesTags
                    villes={draft.villes || []}
                    onChange={v => setDraft(d => ({ ...d, villes: v }))}
                  />
                </Champ>
              </div>
              <button onClick={() => setEtapeForm(2)}
                      className="w-full py-3 rounded-full font-extrabold text-sm tap-scale glow-yellow"
                      style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
                Suivant — Évaluer les compétences →
              </button>
            </div>
          )}

          {/* ── Étape 2 — Mode séance ─────────── */}
          {etapeForm === 2 && (
            <div>

              {/* Sélecteur de mode */}
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'normal', label: '🎯 Entraînement', desc: 'Évaluer les compétences' },
                  { id: 'cepc',   label: '📋 Examen blanc', desc: 'Grille CEPC officielle' },
                ].map(m => (
                  <button key={m.id}
                    onClick={() => { setModeSeance(m.id); setGroupeActifSeance(null) }}
                    className="flex-1 py-2.5 px-2 rounded-xl text-center tap-scale transition-all"
                    style={{
                      background: modeSeance === m.id ? '#B5863C' : 'rgba(33,28,22,0.05)',
                      border: `1px solid ${modeSeance === m.id ? '#B5863C' : 'rgba(33,28,22,0.12)'}`,
                      color: modeSeance === m.id ? '#f8f2e5' : 'rgba(33,28,22,0.55)',
                    }}>
                    <p className="text-[11px] font-extrabold leading-tight">{m.label}</p>
                    <p className="text-[9px] mt-0.5 font-medium opacity-75">{m.desc}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl p-4 mb-3"
                   style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>

                {modeSeance === 'normal' ? (
                  <>
                    <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#B5863C' }}>
                      🎯 Compétences travaillées
                    </p>
                    {renderEtape2()}
                  </>
                ) : (
                  <>
                    <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#B5863C' }}>
                      📋 Grille d'évaluation CEPC
                    </p>

                    {draft.cepc ? (
                      /* Résultat déjà enregistré */
                      <div>
                        <div className="flex items-center gap-3 p-3 rounded-xl mb-2"
                             style={{
                               background: draft.cepc.bilan === 'Favorable'
                                 ? 'rgba(0,204,68,0.10)' : 'rgba(254,0,50,0.10)',
                               border: `1px solid ${draft.cepc.bilan === 'Favorable'
                                 ? 'rgba(0,204,68,0.35)' : 'rgba(254,0,50,0.35)'}`,
                             }}>
                          <span className="text-2xl shrink-0">
                            {draft.cepc.bilan === 'Favorable' ? '✅' : '❌'}
                          </span>
                          <div>
                            <p className="text-sm font-extrabold text-pw-ink">{draft.cepc.total}</p>
                            <p className="text-xs font-bold"
                               style={{ color: draft.cepc.bilan === 'Favorable' ? '#33cc66' : '#ff6680' }}>
                              {draft.cepc.bilan}
                            </p>
                            {draft.cepc.obs && (
                              <p className="text-[10px] text-pw-ink mt-0.5 line-clamp-2">{draft.cepc.obs}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setCepcOuvert(true)}
                          className="text-xs font-semibold tap-scale"
                          style={{ color: 'rgba(181,134,60,0.65)' }}
                        >
                          ✏️ Modifier la grille →
                        </button>
                      </div>
                    ) : (
                      /* Pas encore rempli */
                      <>
                        <p className="text-xs text-pw-ink leading-relaxed mb-3">
                          L'accompagnateur remplit la grille officielle pendant la conduite.
                          La séance dure environ 30 minutes.
                        </p>
                        <button
                          onClick={() => setCepcOuvert(true)}
                          className="w-full py-3.5 rounded-xl font-bold text-sm tap-scale"
                          style={{
                            background: 'rgba(181,134,60,0.10)',
                            border: '1px solid rgba(181,134,60,0.35)',
                            color: '#B5863C',
                          }}
                        >
                          📋 Ouvrir la grille d'évaluation
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (modeSeance === 'normal' && groupeActifSeance) {
                      setGroupeActifSeance(null)
                    } else {
                      setEtapeForm(1)
                    }
                  }}
                  className="py-3 px-5 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid #E8DFD0', color: '#211C16' }}
                >
                  ← Retour
                </button>
                <button
                  onClick={() => { setGroupeActifSeance(null); setEtapeForm(3) }}
                  className="flex-1 py-3 rounded-full font-extrabold text-sm tap-scale"
                  style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}
                >
                  Suivant — Signature →
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 3 — Accompagnateur + Débrief ── */}
          {etapeForm === 3 && (
            <div className="space-y-3">
              {/* Accompagnateur */}
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#B5863C' }}>
                  👥 Accompagnateur·rice
                </p>

                {/* Dropdown — SÉLECTIONNER ou AJOUTER */}
                {accompagnateursRecents.length > 0 && (
                  <Champ label="SÉLECTIONNER ou AJOUTER">
                    <select
                      value={accompSelectValue}
                      onChange={handleSelectAccomp}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink outline-none"
                      style={{
                        background: 'rgba(33,28,22,0.07)',
                        border: '1px solid rgba(33,28,22,0.12)',
                        colorScheme: 'dark',
                      }}
                    >
                      <option value="">-- Choisir un accompagnateur --</option>
                      {accompagnateursRecents.map((a, i) => (
                        <option key={i} value={String(i)}>
                          {a.prenom} {a.nom}{a.numeroPermis ? ` (${a.numeroPermis})` : ''}
                        </option>
                      ))}
                      <option value="autre">+ Ajouter une nouvelle personne…</option>
                    </select>
                  </Champ>
                )}

                {/* Champs manuels si "Autre" ou pas de récents */}
                {(accompagnateursRecents.length === 0 || accompSelectValue === 'autre' || accompSelectValue === '') && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Champ label="Prénom">
                        <input type="text" placeholder="Mohammed"
                               value={draft.accompagnateur.prenom}
                               onChange={e => setAccomp('prenom', e.target.value)}
                               className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none"
                               style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)' }}
                               onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
                               onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'} />
                      </Champ>
                      <Champ label="Nom">
                        <input type="text" placeholder="Martin"
                               value={draft.accompagnateur.nom}
                               onChange={e => setAccomp('nom', e.target.value)}
                               className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none"
                               style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)' }}
                               onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
                               onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'} />
                      </Champ>
                    </div>
                    <Champ label="N° de permis de conduire">
                      <input type="text" placeholder="12AA12345"
                             value={draft.accompagnateur.numeroPermis}
                             onChange={e => setAccomp('numeroPermis', e.target.value.toUpperCase())}
                             maxLength={15}
                             inputMode="numeric"
                             className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/40 outline-none uppercase"
                             style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)' }}
                             onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
                             onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'} />
                      {draft.accompagnateur.numeroPermis.length >= 8 && (
                        <p className="text-[10px] mt-1 font-semibold"
                           style={{ color: validerPermis(draft.accompagnateur.numeroPermis) ? '#33cc66' : '#fb923c' }}>
                          {validerPermis(draft.accompagnateur.numeroPermis)
                            ? '✓ Format valide'
                            : '⚠ Format invalide — ex. 12AA12345 (lettres + chiffres, 8–15 car.)'}
                        </p>
                      )}
                    </Champ>
                  </>
                )}

                {/* Résumé accompagnateur sélectionné */}
                {accompagnateursRecents.length > 0 && accompSelectValue !== '' && accompSelectValue !== 'autre' && (
                  <div className="px-3 py-2.5 rounded-xl mb-2"
                       style={{ background: 'rgba(181,134,60,0.07)', border: '1px solid rgba(181,134,60,0.2)' }}>
                    <p className="text-xs text-pw-ink">
                      <span className="font-bold text-pw-ink">{draft.accompagnateur.prenom} {draft.accompagnateur.nom}</span>
                      {draft.accompagnateur.numeroPermis &&
                        <span className="text-pw-ink"> — Permis {draft.accompagnateur.numeroPermis}</span>
                      }
                    </p>
                  </div>
                )}

                <SignatureCanvas
                  value={draft.signature}
                  onChange={sig => setDraft(d => ({ ...d, signature: sig }))} />
              </div>

              {/* Débrief */}
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-4" style={{ color: '#B5863C' }}>
                  ✍️ Débrief de séance
                </p>

                {/* ── Note /10 avec emoji ── */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-pw-ink mb-3 flex items-center gap-1.5">
                    <span>🌡️</span> Comment tu t'es senti·e au volant ?
                  </label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => {
                      const cfg = NOTE_CONFIG[n]
                      const isSelected = draft.noteVolant === n
                      return (
                        <button
                          key={n}
                          onClick={() => setDraft(d => ({ ...d, noteVolant: n }))}
                          className="flex-1 aspect-square rounded-lg flex items-center justify-center font-extrabold transition-all tap-scale text-[11px]"
                          style={{
                            background: isSelected ? cfg.color : 'rgba(33,28,22,0.06)',
                            border: `2px solid ${isSelected ? cfg.color : 'rgba(33,28,22,0.10)'}`,
                            color: isSelected ? '#fff' : 'rgba(33,28,22,0.45)',
                            fontSize: isSelected ? '18px' : '11px',
                          }}
                        >
                          {isSelected ? cfg.emoji : n}
                        </button>
                      )
                    })}
                  </div>
                  {draft.noteVolant > 0 && (
                    <p className="text-xs text-center mt-2 font-bold"
                       style={{ color: NOTE_CONFIG[draft.noteVolant].color }}>
                      {NOTE_CONFIG[draft.noteVolant].emoji} Note : {draft.noteVolant}/10
                    </p>
                  )}
                </div>

                {/* Champs de débrief avec micro vocal */}
                {[
                  { key: 'debriefTechnique', emoji: '🔧', q: 'Ce qui était difficile / ce qui s\'est bien passé ?' },
                  { key: 'debriefSuite',     emoji: '🎯', q: 'Sur quoi te concentrer à la prochaine séance ?' },
                ].map(({ key, emoji, q }) => (
                  <div key={key} className="mb-3 relative">
                    <label className="text-xs font-semibold text-pw-ink mb-1 flex items-center gap-1.5">
                      <span>{emoji}</span> {q}
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder={micro.supporte ? 'Tape ou dicte avec le micro 🎤' : '...'}
                        value={draft[key]}
                        onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 rounded-xl text-xs text-pw-ink placeholder-pw-ink-soft/30 outline-none resize-none"
                        style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid rgba(33,28,22,0.10)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.10)'}
                      />
                      <BoutonMicro champKey={key} />
                    </div>
                  </div>
                ))}

                <Champ label="Notes libres (optionnel)">
                  <div className="relative">
                    <textarea rows={2} placeholder={micro.supporte ? 'Tape ou dicte avec le micro 🎤' : 'Consignes, points à retenir...'}
                              value={draft.notes}
                              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                              className="w-full px-3 py-2 pr-10 rounded-xl text-xs text-pw-ink placeholder-pw-ink-soft/30 outline-none resize-none"
                              style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid rgba(33,28,22,0.10)' }}
                              onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.5)'}
                              onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.10)'} />
                    <BoutonMicro champKey="notes" />
                  </div>
                </Champ>

                {micro.supporte && (
                  <p className="text-[9px] text-pw-ink-soft/35 -mt-1">
                    🎤 Appuie sur le micro pour dicter — fonctionne sur Chrome
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEtapeForm(2)}
                        className="py-3 px-5 rounded-full text-sm font-bold"
                        style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid #E8DFD0', color: '#211C16' }}>
                  ← Retour
                </button>
                <button onClick={handleSave}
                        className="flex-1 py-3 rounded-full font-extrabold text-sm tap-scale glow-yellow"
                        style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
                  ✅ Valider la séance
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── LISTE DES SÉANCES — toujours dépliée ────────────── */}
      {vue === 'liste' && (
        <>
          {seances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-sm font-semibold text-pw-ink">Aucune séance encore</p>
              <p className="text-xs mt-1 text-pw-ink">
                Appuie sur + Séance après chaque entraînement
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {seances.map(s => {
                const d = dureeSeance(s)
                const nbComp = Object.keys(s.competencesEvaluees || {}).filter(k => s.competencesEvaluees[k] > 0).length
                const compGrouped = COMPETENCES_PW.map(g => ({
                  groupe: g,
                  scs: g.sousCompetences
                    .filter(sc => (s.competencesEvaluees?.[sc.id] || 0) > 0)
                    .map(sc => ({ ...sc, etat: s.competencesEvaluees[sc.id] }))
                })).filter(g => g.scs.length > 0)

                // Compatibilité : anciens enregistrements avec lieu (string)
                const villesStr = s.villes?.length
                  ? s.villes.join(' · ')
                  : s.lieu || ''

                return (
                  <div key={s.id} className="rounded-2xl overflow-hidden"
                       style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>

                    <div className="px-4 pt-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                           style={{ background: 'rgba(181,134,60,0.12)', border: '1px solid rgba(181,134,60,0.25)' }}>
                        🚗
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-pw-ink">{formatDate(s.date)}</p>
                        <p className="text-[10px] text-pw-ink">
                          {d ? `${d}` : ''}
                          {s.km ? ` · ${s.km} km` : ''}
                          {villesStr ? ` · ${villesStr}` : ''}
                          {nbComp > 0 ? ` · ${nbComp} compétence${nbComp > 1 ? 's' : ''}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {s.cepc && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                style={{
                                  background: s.cepc.bilan === 'Favorable'
                                    ? 'rgba(0,153,51,0.2)' : 'rgba(254,0,50,0.15)',
                                  color: s.cepc.bilan === 'Favorable' ? '#33cc66' : '#ff6680',
                                  border: `1px solid ${s.cepc.bilan === 'Favorable'
                                    ? 'rgba(0,153,51,0.4)' : 'rgba(254,0,50,0.35)'}`,
                                }}>
                            📋 {s.cepc.total}
                          </span>
                        )}
                        {s.signature && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                style={{ background: '#f8f2e5', color: '#937025', border: '1px solid #B5863C' }}>
                            ✓ Signé
                          </span>
                        )}
                        {s.noteVolant > 0 && NOTE_CONFIG[s.noteVolant] && (
                          <span className="text-base leading-none"
                                title={`Ressenti : ${s.noteVolant}/10`}>
                            {NOTE_CONFIG[s.noteVolant].emoji}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-3 mt-3 border-t border-pw-line/[0.06] space-y-3">
                      {s.accompagnateur?.nom && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-1">
                            Accompagnateur·rice
                          </p>
                          <p className="text-xs text-pw-ink">
                            {s.accompagnateur.prenom} {s.accompagnateur.nom}
                            {s.accompagnateur.numeroPermis ? ` — Permis ${s.accompagnateur.numeroPermis}` : ''}
                          </p>
                        </div>
                      )}

                      {compGrouped.length > 0 && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-2">
                            Compétences évaluées
                          </p>
                          <div className="space-y-2.5">
                            {compGrouped.map(({ groupe, scs }) => {
                              const c = COULEURS[groupe.couleur]
                              return (
                                <div key={groupe.id}>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold text-pw-cream"
                                          style={{ background: c.solid }}>{groupe.id}</span>
                                    <p className="text-[9px] font-extrabold uppercase tracking-wide"
                                       style={{ color: c.text }}>
                                      {groupe.emoji} {groupe.titre}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    {scs.map(sc => (
                                      <div key={sc.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                                           style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.07)' }}>
                                        <CarreEtat etat={sc.etat} size="sm" />
                                        <span className="text-[10px] text-pw-ink">{sc.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {s.signature && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-1">Signature</p>
                          <img src={s.signature} alt="Signature accompagnateur" className="h-10 opacity-80" />
                        </div>
                      )}

                      {s.cepc && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-1.5">
                            Examen blanc CEPC
                          </p>
                          <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                               style={{
                                 background: s.cepc.bilan === 'Favorable'
                                   ? 'rgba(0,204,68,0.08)' : 'rgba(254,0,50,0.08)',
                                 border: `1px solid ${s.cepc.bilan === 'Favorable'
                                   ? 'rgba(0,204,68,0.28)' : 'rgba(254,0,50,0.28)'}`,
                               }}>
                            <span className="text-2xl shrink-0 mt-0.5">
                              {s.cepc.bilan === 'Favorable' ? '✅' : '❌'}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-extrabold text-pw-ink">{s.cepc.total}</p>
                              <p className="text-xs font-bold"
                                 style={{ color: s.cepc.bilan === 'Favorable' ? '#33cc66' : '#ff6680' }}>
                                {s.cepc.bilan} · {s.cepc.date}
                              </p>
                              {s.cepc.obs && (
                                <p className="text-xs text-pw-ink mt-1 leading-relaxed">{s.cepc.obs}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {(s.noteVolant > 0 || s.debriefTechnique || s.debriefSuite || s.debriefRessenti) && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-1.5">Débrief</p>
                          <div className="space-y-1">
                            {s.noteVolant > 0 && NOTE_CONFIG[s.noteVolant] && (
                              <p className="text-xs text-pw-ink">
                                {NOTE_CONFIG[s.noteVolant].emoji} Ressenti au volant : {s.noteVolant}/10
                              </p>
                            )}
                            {/* Rétrocompat séances avec debriefRessenti texte */}
                            {s.debriefRessenti && <p className="text-xs text-pw-ink">🌡️ {s.debriefRessenti}</p>}
                            {s.debriefTechnique && <p className="text-xs text-pw-ink">🔧 {s.debriefTechnique}</p>}
                            {s.debriefSuite     && <p className="text-xs text-pw-ink">🎯 {s.debriefSuite}</p>}
                          </div>
                        </div>
                      )}

                      {s.notes && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-1">Notes</p>
                          <p className="text-xs text-pw-ink">{s.notes}</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs pt-1 transition-colors"
                        style={{ color: 'rgba(248,113,113,0.45)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(248,113,113,0.8)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,113,113,0.45)'}
                      >
                        Supprimer cette séance
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
    </>
  )
}

function Champ({ label, children }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-bold uppercase tracking-wide text-pw-ink mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  )
}
