// Onglet 3 — Séances (liste + nouvelle séance avec signature)
import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, ETATS_PW } from '../data/competences-pw'
import SignatureCanvas from '../components/SignatureCanvas'
import { CarreEtat } from './Competences'

const OBJECTIFS_FLAT = COMPETENCES_PW.flatMap(g =>
  g.sousCompetences.map(sc => ({ ...sc, groupeId: g.id, groupeTitre: g.titre, couleur: g.couleur }))
)

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
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

export default function Seances({ ouvrirForm }) {
  const [seances, setSeances] = useLocalStorage('pw_seances', [])
  const [etatsGlobal, setEtatsGlobal] = useLocalStorage('pw_competences', {})
  const [vue, setVue] = useState(ouvrirForm ? 'form' : 'liste')
  const [draft, setDraft] = useState(newSeance())
  const [seanceOuverte, setSeanceOuverte] = useState(null)
  const [etapeForm, setEtapeForm] = useState(1) // 1: infos, 2: compétences, 3: accompagnateur+débrief

  const handleSave = () => {
    if (!draft.date) return
    // Sauvegarder la séance
    setSeances(prev => [draft, ...prev])
    // Mettre à jour les états des compétences si la nouvelle valeur est supérieure
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
    setVue('liste')
  }

  const setEtatSc = (id, val) => {
    setDraft(d => ({ ...d, competencesEvaluees: { ...d.competencesEvaluees, [id]: val } }))
  }

  const setAccomp = (champ, val) => {
    setDraft(d => ({ ...d, accompagnateur: { ...d.accompagnateur, [champ]: val } }))
  }

  const handleDelete = (id) => {
    setSeances(prev => prev.filter(s => s.id !== id))
    if (seanceOuverte === id) setSeanceOuverte(null)
  }

  const totalSeances = seances.length
  const totalKm = seances.reduce((s, x) => s + (parseInt(x.km) || 0), 0)

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">
            {vue === 'form' ? 'Nouvelle séance' : 'Mes séances'}
          </h1>
          {vue === 'liste' && (
            <p className="text-xs text-white/50 mt-0.5">
              {totalSeances} séance{totalSeances !== 1 ? 's' : ''} · {totalKm} km
            </p>
          )}
        </div>
        {vue === 'liste' ? (
          <button onClick={() => { setDraft(newSeance()); setEtapeForm(1); setVue('form') }}
                  className="px-4 py-2 rounded-full text-xs font-extrabold transition-all active:scale-95"
                  style={{ background: '#FFBE00', color: '#07111f' }}>
            + Séance
          </button>
        ) : (
          <button onClick={() => { setVue('liste'); setEtapeForm(1) }}
                  className="text-xs text-white/50 hover:text-white/70">
            Annuler
          </button>
        )}
      </div>

      {/* === FORMULAIRE NOUVELLE SÉANCE === */}
      {vue === 'form' && (
        <>
          {/* Étapes */}
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3].map(e => (
              <div key={e} className="flex-1 h-1 rounded-full transition-all"
                   style={{ background: e <= etapeForm ? '#FFBE00' : 'rgba(255,255,255,0.12)' }} />
            ))}
          </div>

          {/* Étape 1 — Infos de la séance */}
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
                <div className="grid grid-cols-2 gap-3">
                  <Champ label="Heure début">
                    <input type="time" value={draft.heureDebut}
                           onChange={e => setDraft(d => ({ ...d, heureDebut: e.target.value }))}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                  <Champ label="Heure fin">
                    <input type="time" value={draft.heureFin}
                           onChange={e => setDraft(d => ({ ...d, heureFin: e.target.value }))}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Champ label="Km parcourus">
                    <input type="number" inputMode="numeric" placeholder="35"
                           value={draft.km}
                           onChange={e => setDraft(d => ({ ...d, km: e.target.value }))}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                  <Champ label="Lieu (ville)">
                    <input type="text" placeholder="Paris 15e"
                           value={draft.lieu}
                           onChange={e => setDraft(d => ({ ...d, lieu: e.target.value }))}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                </div>
              </div>
              <button onClick={() => setEtapeForm(2)}
                      className="w-full py-3 rounded-full font-extrabold text-sm transition-all active:scale-95"
                      style={{ background: '#FFBE00', color: '#07111f' }}>
                Suivant — Évaluer les compétences →
              </button>
            </div>
          )}

          {/* Étape 2 — Compétences évaluées */}
          {etapeForm === 2 && (
            <div>
              <div className="rounded-2xl p-4 mb-3"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-1" style={{ color: '#FFBE00' }}>
                  📋 Compétences travaillées
                </p>
                <p className="text-[10px] text-white/45 mb-3">
                  Appuie sur le carré pour changer l'état. Seules les compétences améliorées seront mises à jour dans ton livret.
                </p>
                <div className="space-y-1.5 max-h-[55vh] overflow-y-auto scrollbar-thin pr-1">
                  {OBJECTIFS_FLAT.map(sc => {
                    const etatSeance = draft.competencesEvaluees[sc.id] ?? 0
                    return (
                      <div key={sc.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
                           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <button onClick={() => setEtatSc(sc.id, (etatSeance + 1) % 4)}
                                className="shrink-0 transition-all active:scale-90">
                          <CarreEtat etat={etatSeance} size="md" />
                        </button>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-white/35 mr-1">{sc.id}</span>
                          <span className="text-xs text-white/75">{sc.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEtapeForm(1)}
                        className="py-3 px-4 rounded-full text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  ← Retour
                </button>
                <button onClick={() => setEtapeForm(3)}
                        className="flex-1 py-3 rounded-full font-extrabold text-sm transition-all active:scale-95"
                        style={{ background: '#FFBE00', color: '#07111f' }}>
                  Suivant — Signature →
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 — Accompagnateur + Débrief + Signature */}
          {etapeForm === 3 && (
            <div className="space-y-3">
              {/* Accompagnateur */}
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#FFBE00' }}>
                  👥 Accompagnateur·rice
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Champ label="Prénom">
                    <input type="text" placeholder="Mohammed"
                           value={draft.accompagnateur.prenom}
                           onChange={e => setAccomp('prenom', e.target.value)}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                  <Champ label="Nom">
                    <input type="text" placeholder="Martin"
                           value={draft.accompagnateur.nom}
                           onChange={e => setAccomp('nom', e.target.value)}
                           className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                           style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                           onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                           onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </Champ>
                </div>
                <Champ label="N° de permis de conduire">
                  <input type="text" placeholder="12AA12345"
                         value={draft.accompagnateur.numeroPermis}
                         onChange={e => setAccomp('numeroPermis', e.target.value)}
                         className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none uppercase"
                         style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                         onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                         onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </Champ>
                <SignatureCanvas
                  value={draft.signature}
                  onChange={sig => setDraft(d => ({ ...d, signature: sig }))} />
              </div>

              {/* Débrief rapide */}
              <div className="rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: '#FFBE00' }}>
                  ✍️ Débrief de séance
                </p>
                {[
                  { key: 'debriefRessenti', emoji: '🌡️', q: 'Comment tu t\'es senti·e au volant ?' },
                  { key: 'debriefTechnique', emoji: '🔧', q: 'Ce qui était difficile / ce qui s\'est bien passé ?' },
                  { key: 'debriefSuite', emoji: '🎯', q: 'Sur quoi te concentrer à la prochaine séance ?' },
                ].map(({ key, emoji, q }) => (
                  <div key={key} className="mb-3">
                    <label className="text-xs font-semibold text-white/60 mb-1 flex items-center gap-1.5">
                      <span>{emoji}</span> {q}
                    </label>
                    <textarea rows={2} placeholder="..."
                              value={draft[key]}
                              onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl text-xs text-white placeholder-white/20 outline-none resize-none"
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                              onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.5)'}
                              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                ))}
                <Champ label="Notes libres (optionnel)">
                  <textarea rows={2} placeholder="Consignes, points à retenir..."
                            value={draft.notes}
                            onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-xs text-white placeholder-white/20 outline-none resize-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </Champ>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEtapeForm(2)}
                        className="py-3 px-4 rounded-full text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  ← Retour
                </button>
                <button onClick={handleSave}
                        className="flex-1 py-3 rounded-full font-extrabold text-sm transition-all active:scale-95"
                        style={{ background: '#FFBE00', color: '#07111f' }}>
                  ✅ Valider la séance
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* === LISTE DES SÉANCES === */}
      {vue === 'liste' && (
        <>
          {seances.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-sm font-semibold">Aucune séance encore</p>
              <p className="text-xs mt-1">Appuie sur + Séance après chaque entraînement</p>
            </div>
          ) : (
            <div className="space-y-3">
              {seances.map(s => {
                const isOpen = seanceOuverte === s.id
                const d = dureeSeance(s)
                const nbComp = Object.keys(s.competencesEvaluees || {}).filter(k => s.competencesEvaluees[k] > 0).length
                return (
                  <div key={s.id} className="rounded-2xl overflow-hidden"
                       style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <button className="w-full px-4 py-3 flex items-center justify-between"
                            onClick={() => setSeanceOuverte(isOpen ? null : s.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                             style={{ background: 'rgba(255,190,0,0.12)', border: '1px solid rgba(255,190,0,0.25)' }}>
                          🚗
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">{formatDate(s.date)}</p>
                          <p className="text-[10px] text-white/40">
                            {d ? `${d}` : ''}{s.km ? ` · ${s.km} km` : ''}{s.lieu ? ` · ${s.lieu}` : ''}
                            {nbComp > 0 ? ` · ${nbComp} compétence${nbComp > 1 ? 's' : ''}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {s.signature && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                                style={{ background: 'rgba(29,158,117,0.2)', color: '#34d399', border: '1px solid rgba(29,158,117,0.4)' }}>
                            ✓ Signé
                          </span>
                        )}
                        <span className="text-white/40 text-xs transition-transform duration-200"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-white/[0.06] pt-3 space-y-3">
                        {/* Accompagnateur */}
                        {s.accompagnateur?.nom && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1">Accompagnateur·rice</p>
                            <p className="text-xs text-white/70">
                              {s.accompagnateur.prenom} {s.accompagnateur.nom}
                              {s.accompagnateur.numeroPermis ? ` — Permis ${s.accompagnateur.numeroPermis}` : ''}
                            </p>
                          </div>
                        )}
                        {/* Compétences */}
                        {nbComp > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1.5">Compétences évaluées</p>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(s.competencesEvaluees).filter(([, v]) => v > 0).map(([id, val]) => (
                                <div key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                     style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                  <CarreEtat etat={val} size="sm" />
                                  <span className="text-[10px] text-white/60">{id}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Signature */}
                        {s.signature && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1">Signature</p>
                            <img src={s.signature} alt="Signature" className="h-10 opacity-80" />
                          </div>
                        )}
                        {/* Débrief */}
                        {(s.debriefRessenti || s.debriefTechnique || s.debriefSuite) && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1">Débrief</p>
                            {s.debriefRessenti && <p className="text-xs text-white/65">🌡️ {s.debriefRessenti}</p>}
                            {s.debriefTechnique && <p className="text-xs text-white/65">🔧 {s.debriefTechnique}</p>}
                            {s.debriefSuite && <p className="text-xs text-white/65">🎯 {s.debriefSuite}</p>}
                          </div>
                        )}
                        <button onClick={() => handleDelete(s.id)}
                                className="text-xs text-red-400/50 hover:text-red-400 transition-colors">
                          Supprimer cette séance
                        </button>
                      </div>
                    )}
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
      <label className="text-xs font-bold uppercase tracking-wide text-white/60 mb-1 block">{label}</label>
      {children}
    </div>
  )
}
