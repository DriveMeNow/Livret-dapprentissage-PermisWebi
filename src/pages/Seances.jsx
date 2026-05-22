/**
 * Onglet Séances — V1.2
 * - Heure numérique (dropdowns H/MM, pas d'horloge analogique)
 * - Étape 2 : vignettes de groupes → sous-compétences (sans préfixe)
 * - Légende des états dans les compétences
 * - Accompagnateur : sélection rapide parmi les récents + validation format permis
 * - Liste des séances : toujours dépliée, compétences regroupées par groupe
 */
import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, COULEURS, ETATS_PW } from '../data/competences-pw'
import SignatureCanvas from '../components/SignatureCanvas'
import { CarreEtat } from './Competences'

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
    heureDebut: '', heureFin: '', km: '', lieu: '',
    competencesEvaluees: {},
    accompagnateur: { nom: '', prenom: '', numeroPermis: '' },
    signature: null,
    notes: '',
    debriefRessenti: '', debriefTechnique: '', debriefSuite: '',
  }
}

/** Validation du numéro de permis de conduire français (8–15 caractères alphanumériques) */
function validerPermis(num) {
  if (!num) return null
  const n = num.replace(/[\s\-\.]/g, '').toUpperCase()
  if (n.length < 8) return null // trop court pour valider
  if (n.length > 15) return false
  if (!/^[A-Z0-9]+$/.test(n)) return false
  if (!/\d/.test(n)) return false // doit contenir au moins un chiffre
  return true
}

/** Sélecteur d'heure numérique — deux dropdowns (HH + MM par tranche de 5) */
function SaisieHeure({ label, value, onChange }) {
  const parts = (value || '').split(':')
  const hVal = parts[0] || ''
  const mVal = parts[1] || ''

  const update = (h, m) => {
    if (!h && !m) { onChange(''); return }
    onChange(`${(h || '00').padStart(2, '0')}:${(m || '00').padStart(2, '0')}`)
  }

  const sel = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    colorScheme: 'dark',
  }

  return (
    <div className="mb-3">
      <label className="text-xs font-bold uppercase tracking-wide text-white/70 mb-1.5 block">{label}</label>
      <div className="flex gap-2 items-center">
        <select
          value={hVal}
          onChange={e => update(e.target.value, mVal)}
          className="flex-1 px-2 py-2.5 rounded-xl text-sm text-white outline-none text-center"
          style={sel}
        >
          <option value="">hh</option>
          {Array.from({ length: 24 }, (_, i) => i).map(h => (
            <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}</option>
          ))}
        </select>
        <span className="text-white/50 font-bold text-xl leading-none">:</span>
        <select
          value={mVal}
          onChange={e => update(hVal, e.target.value)}
          className="flex-1 px-2 py-2.5 rounded-xl text-sm text-white outline-none text-center"
          style={sel}
        >
          <option value="">mm</option>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
            <option key={m} value={String(m).padStart(2, '0')}>{String(m).padStart(2, '0')}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function Seances({ ouvrirForm }) {
  const [seances, setSeances] = useLocalStorage('pw_seances', [])
  const [etatsGlobal, setEtatsGlobal] = useLocalStorage('pw_competences', {})
  const [vue, setVue] = useState(ouvrirForm ? 'form' : 'liste')
  const [draft, setDraft] = useState(newSeance())
  const [etapeForm, setEtapeForm] = useState(1)
  // Étape 2 : null = vue groupes, 'C1'…'C4' = sous-compétences du groupe
  const [groupeActifSeance, setGroupeActifSeance] = useState(null)

  /** Accompagnateurs uniques déjà utilisés (max 5) pour sélection rapide */
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

  const handleSave = () => {
    if (!draft.date) return
    setSeances(prev => [draft, ...prev])
    // Mettre à jour les compétences globales si la valeur séance est supérieure
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
    setVue('liste')
  }

  const setEtatSc = (id, val) => {
    setDraft(d => ({ ...d, competencesEvaluees: { ...d.competencesEvaluees, [id]: val } }))
  }
  const setAccomp = (champ, val) => {
    setDraft(d => ({ ...d, accompagnateur: { ...d.accompagnateur, [champ]: val } }))
  }
  const handleDelete = (id) => setSeances(prev => prev.filter(s => s.id !== id))

  const totalSeances = seances.length
  const totalKm = seances.reduce((s, x) => s + (parseInt(x.km) || 0), 0)

  // ── Rendu Étape 2 : groupes ou sous-compétences ───────────────
  const renderEtape2 = () => {
    if (groupeActifSeance) {
      const groupe = COMPETENCES_PW.find(g => g.id === groupeActifSeance)
      const c = COULEURS[groupe.couleur]
      return (
        <div>
          {/* Header groupe + retour */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setGroupeActifSeance(null)}
              className="text-sm font-semibold shrink-0 transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              ← Retour
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg">{groupe.emoji}</span>
              <p className="text-sm font-extrabold text-white">{groupe.titre}</p>
            </div>
          </div>

          {/* Légende des états */}
          <div className="flex gap-3 mb-3 flex-wrap">
            {Object.entries(ETATS_PW).filter(([k]) => k !== '0').map(([niveau, e]) => (
              <div key={niveau} className="flex items-center gap-1.5">
                <CarreEtat etat={parseInt(niveau)} size="sm" />
                <span className="text-[10px] text-white/70">{e.label}</span>
              </div>
            ))}
          </div>

          {/* Sous-compétences sans préfixe */}
          <div className="space-y-1.5 max-h-[45vh] overflow-y-auto scrollbar-thin pr-1">
            {groupe.sousCompetences.map(sc => {
              const etatSeance = draft.competencesEvaluees[sc.id] ?? 0
              return (
                <div key={sc.id}
                     className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <button
                    onClick={() => setEtatSc(sc.id, (etatSeance + 1) % 4)}
                    className="shrink-0 transition-all active:scale-90"
                  >
                    <CarreEtat etat={etatSeance} size="md" />
                  </button>
                  <span className="text-xs text-white/85">{sc.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // Vue groupes : 4 vignettes
    return (
      <div className="space-y-2.5">
        <p className="text-[10px] text-white/55 mb-1">
          Sélectionne un groupe pour évaluer les compétences travaillées pendant cette séance.
        </p>
        {COMPETENCES_PW.map(g => {
          const nbEvalues = g.sousCompetences.filter(sc => (draft.competencesEvaluees[sc.id] || 0) > 0).length
          const c = COULEURS[g.couleur]
          return (
            <button
              key={g.id}
              onClick={() => setGroupeActifSeance(g.id)}
              className="w-full rounded-2xl p-3.5 text-left tap-scale"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{g.titre}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: c.text }}>
                    {nbEvalues > 0
                      ? `${nbEvalues} compétence${nbEvalues > 1 ? 's' : ''} évaluée${nbEvalues > 1 ? 's' : ''}`
                      : 'Appuyer pour évaluer →'}
                  </p>
                </div>
                {nbEvalues > 0 && (
                  <span className="text-base font-extrabold shrink-0" style={{ color: c.text }}>
                    {nbEvalues}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* ── En-tête ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">
            {vue === 'form' ? 'Nouvelle séance' : 'Mes séances'}
          </h1>
          {vue === 'liste' && (
            <p className="text-xs text-white/60 mt-0.5">
              {totalSeances} séance{totalSeances !== 1 ? 's' : ''} · {totalKm} km
            </p>
          )}
        </div>
        {vue === 'liste' ? (
          <button
            onClick={() => { setDraft(newSeance()); setEtapeForm(1); setGroupeActifSeance(null); setVue('form') }}
            className="px-4 py-2 rounded-full text-xs font-extrabold tap-scale"
            style={{ background: '#FFBE00', color: '#07111f' }}
          >
            + Séance
          </button>
        ) : (
          <button
            onClick={() => { setVue('liste'); setEtapeForm(1); setGroupeActifSeance(null) }}
            className="text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.60)' }}
          >
            Annuler
          </button>
        )}
      </div>

      {/* ── FORMULAIRE ──────────────────────────── */}
      {vue === 'form' && (
        <>
          {/* Barre d'étapes */}
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3].map(e => (
              <div key={e} className="flex-1 h-1 rounded-full transition-all"
                   style={{ background: e <= etapeForm ? '#FFBE00' : 'rgba(255,255,255,0.12)' }} />
            ))}
          </div>

          {/* Étape 1 — Infos de séance */}
          {etapeForm === 1 && (
            <div className="space-y-3">
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#FFBE00' }}>
                  📅 Informations de la séance
                </p>
                <Champ label="Date">
                  <input type="date" value={draft.date}
                         onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
                         className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                         style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                         onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                         onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </Champ>

                {/* Heures numériques — dropdowns */}
                <div className="grid grid-cols-2 gap-3">
                  <SaisieHeure label="Heure début" value={draft.heureDebut}
                               onChange={v => setDraft(d => ({ ...d, heureDebut: v }))} />
                  <SaisieHeure label="Heure fin" value={draft.heureFin}
                               onChange={v => setDraft(d => ({ ...d, heureFin: v }))} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Champ label="Km parcourus">
                    <input type="number" inputMode="numeric" placeholder="35"
                           value={draft.km}
                           onChange={e => setDraft(d => ({ ...d, km: e.target.value }))}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                  <Champ label="Lieu (ville)">
                    <input type="text" placeholder="Paris 15e"
                           value={draft.lieu}
                           onChange={e => setDraft(d => ({ ...d, lieu: e.target.value }))}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                </div>
              </div>
              <button onClick={() => setEtapeForm(2)}
                      className="w-full py-3 rounded-full font-extrabold text-sm tap-scale glow-yellow"
                      style={{ background: '#FFBE00', color: '#07111f' }}>
                Suivant — Évaluer les compétences →
              </button>
            </div>
          )}

          {/* Étape 2 — Compétences par groupes */}
          {etapeForm === 2 && (
            <div>
              <div className="rounded-2xl p-4 mb-3"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#FFBE00' }}>
                  📋 Compétences travaillées
                </p>
                {renderEtape2()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => groupeActifSeance ? setGroupeActifSeance(null) : setEtapeForm(1)}
                  className="py-3 px-5 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.72)' }}
                >
                  ← Retour
                </button>
                <button
                  onClick={() => { setGroupeActifSeance(null); setEtapeForm(3) }}
                  className="flex-1 py-3 rounded-full font-extrabold text-sm tap-scale"
                  style={{ background: '#FFBE00', color: '#07111f' }}
                >
                  Suivant — Signature →
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 — Accompagnateur + Signature + Débrief */}
          {etapeForm === 3 && (
            <div className="space-y-3">

              {/* Accompagnateur */}
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#FFBE00' }}>
                  👥 Accompagnateur·rice
                </p>

                {/* Sélection rapide — accompagnateurs récents */}
                {accompagnateursRecents.length > 0 && !draft.accompagnateur.nom && (
                  <div className="mb-4">
                    <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wide mb-2">
                      Récemment utilisé
                    </p>
                    <div className="space-y-1.5">
                      {accompagnateursRecents.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => setDraft(d => ({ ...d, accompagnateur: { ...a } }))}
                          className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between tap-scale"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                        >
                          <span className="text-sm font-semibold text-white/88">
                            {a.prenom} {a.nom}
                          </span>
                          {a.numeroPermis && (
                            <span className="text-[10px] text-white/40 shrink-0 ml-2">
                              Permis {a.numeroPermis}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
                      <span className="text-[10px] text-white/35">ou saisir manuellement</span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
                    </div>
                  </div>
                )}

                {/* Champs manuels */}
                <div className="grid grid-cols-2 gap-3">
                  <Champ label="Prénom">
                    <input type="text" placeholder="Mohammed"
                           value={draft.accompagnateur.prenom}
                           onChange={e => setAccomp('prenom', e.target.value)}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                  <Champ label="Nom">
                    <input type="text" placeholder="Martin"
                           value={draft.accompagnateur.nom}
                           onChange={e => setAccomp('nom', e.target.value)}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                </div>

                <Champ label="N° de permis de conduire">
                  <input
                    type="text"
                    placeholder="12AA12345"
                    value={draft.accompagnateur.numeroPermis}
                    onChange={e => setAccomp('numeroPermis', e.target.value.toUpperCase())}
                    maxLength={15}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none uppercase"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  {draft.accompagnateur.numeroPermis.length >= 8 && (
                    <p className="text-[10px] mt-1 font-semibold"
                       style={{ color: validerPermis(draft.accompagnateur.numeroPermis) ? '#34d399' : '#fb923c' }}>
                      {validerPermis(draft.accompagnateur.numeroPermis)
                        ? '✓ Format valide'
                        : '⚠ Format invalide — ex. 12AA12345 (lettres + chiffres, 8–15 car.)'}
                    </p>
                  )}
                </Champ>

                <SignatureCanvas
                  value={draft.signature}
                  onChange={sig => setDraft(d => ({ ...d, signature: sig }))} />
              </div>

              {/* Débrief */}
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#FFBE00' }}>
                  ✍️ Débrief de séance
                </p>
                {[
                  { key: 'debriefRessenti',  emoji: '🌡️', q: 'Comment tu t\'es senti·e au volant ?' },
                  { key: 'debriefTechnique', emoji: '🔧', q: 'Ce qui était difficile / ce qui s\'est bien passé ?' },
                  { key: 'debriefSuite',     emoji: '🎯', q: 'Sur quoi te concentrer à la prochaine séance ?' },
                ].map(({ key, emoji, q }) => (
                  <div key={key} className="mb-3">
                    <label className="text-xs font-semibold text-white/72 mb-1 flex items-center gap-1.5">
                      <span>{emoji}</span> {q}
                    </label>
                    <textarea rows={2} placeholder="..."
                              value={draft[key]}
                              onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl text-xs text-white placeholder-white/25 outline-none resize-none"
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                              onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.5)'}
                              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                  </div>
                ))}
                <Champ label="Notes libres (optionnel)">
                  <textarea rows={2} placeholder="Consignes, points à retenir..."
                            value={draft.notes}
                            onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-xs text-white placeholder-white/25 outline-none resize-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
                </Champ>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEtapeForm(2)}
                        className="py-3 px-5 rounded-full text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.72)' }}>
                  ← Retour
                </button>
                <button onClick={handleSave}
                        className="flex-1 py-3 rounded-full font-extrabold text-sm tap-scale glow-yellow"
                        style={{ background: '#FFBE00', color: '#07111f' }}>
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
              <p className="text-sm font-semibold text-white/55">Aucune séance encore</p>
              <p className="text-xs mt-1 text-white/35">
                Appuie sur + Séance après chaque entraînement
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {seances.map(s => {
                const d = dureeSeance(s)
                const nbComp = Object.keys(s.competencesEvaluees || {}).filter(k => s.competencesEvaluees[k] > 0).length

                // Compétences regroupées par groupe pour affichage lisible
                const compGrouped = COMPETENCES_PW.map(g => ({
                  groupe: g,
                  scs: g.sousCompetences
                    .filter(sc => (s.competencesEvaluees?.[sc.id] || 0) > 0)
                    .map(sc => ({ ...sc, etat: s.competencesEvaluees[sc.id] }))
                })).filter(g => g.scs.length > 0)

                return (
                  <div key={s.id} className="rounded-2xl overflow-hidden"
                       style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>

                    {/* Header */}
                    <div className="px-4 pt-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                           style={{ background: 'rgba(255,190,0,0.12)', border: '1px solid rgba(255,190,0,0.25)' }}>
                        🚗
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-white">{formatDate(s.date)}</p>
                        <p className="text-[10px] text-white/55">
                          {d ? `${d}` : ''}
                          {s.km ? ` · ${s.km} km` : ''}
                          {s.lieu ? ` · ${s.lieu}` : ''}
                          {nbComp > 0 ? ` · ${nbComp} compétence${nbComp > 1 ? 's' : ''}` : ''}
                        </p>
                      </div>
                      {s.signature && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                              style={{ background: 'rgba(29,158,117,0.2)', color: '#34d399', border: '1px solid rgba(29,158,117,0.4)' }}>
                          ✓ Signé
                        </span>
                      )}
                    </div>

                    {/* Détail toujours visible */}
                    <div className="px-4 pb-4 pt-3 mt-3 border-t border-white/[0.06] space-y-3">

                      {/* Accompagnateur */}
                      {s.accompagnateur?.nom && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40 mb-1">
                            Accompagnateur·rice
                          </p>
                          <p className="text-xs text-white/78">
                            {s.accompagnateur.prenom} {s.accompagnateur.nom}
                            {s.accompagnateur.numeroPermis
                              ? ` — Permis ${s.accompagnateur.numeroPermis}`
                              : ''}
                          </p>
                        </div>
                      )}

                      {/* Compétences groupées */}
                      {compGrouped.length > 0 && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40 mb-2">
                            Compétences évaluées
                          </p>
                          <div className="space-y-2.5">
                            {compGrouped.map(({ groupe, scs }) => {
                              const c = COULEURS[groupe.couleur]
                              return (
                                <div key={groupe.id}>
                                  <p className="text-[9px] font-extrabold uppercase tracking-wide mb-1.5"
                                     style={{ color: c.text }}>
                                    {groupe.emoji} {groupe.titre}
                                  </p>
                                  <div className="space-y-1">
                                    {scs.map(sc => (
                                      <div key={sc.id}
                                           className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                                           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <CarreEtat etat={sc.etat} size="sm" />
                                        <span className="text-[10px] text-white/72">{sc.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Signature */}
                      {s.signature && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40 mb-1">
                            Signature
                          </p>
                          <img src={s.signature} alt="Signature accompagnateur" className="h-10 opacity-80" />
                        </div>
                      )}

                      {/* Débrief */}
                      {(s.debriefRessenti || s.debriefTechnique || s.debriefSuite) && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40 mb-1.5">
                            Débrief
                          </p>
                          <div className="space-y-1">
                            {s.debriefRessenti  && <p className="text-xs text-white/72">🌡️ {s.debriefRessenti}</p>}
                            {s.debriefTechnique && <p className="text-xs text-white/72">🔧 {s.debriefTechnique}</p>}
                            {s.debriefSuite     && <p className="text-xs text-white/72">🎯 {s.debriefSuite}</p>}
                          </div>
                        </div>
                      )}

                      {/* Notes libres */}
                      {s.notes && (
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40 mb-1">Notes</p>
                          <p className="text-xs text-white/72">{s.notes}</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs transition-colors pt-1"
                        style={{ color: 'rgba(248,113,113,0.40)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(248,113,113,0.75)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,113,113,0.40)'}
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
  )
}

function Champ({ label, children }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-bold uppercase tracking-wide text-white/70 mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  )
}
