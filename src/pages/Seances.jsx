// Onglet 4 — Journal de séances
// TON : Permis Webi — chaleureux, tutoiement

import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { GROUPES_REMC } from '../data/remc'

const OBJECTIFS_FLAT = GROUPES_REMC.flatMap(g =>
  g.objectifs.map(o => ({ ...o, groupe: g.id, groupeTitre: g.titre }))
)

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function newSeance() {
  return {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    heureDebut: '',
    heureFin: '',
    km: '',
    conditions: '',
    objectifsAbordes: [],
    commentaire: '',
  }
}

export default function Seances() {
  const [seances, setSeances] = useLocalStorage('pw_seances', [])
  const [afficher, setAfficher] = useState('liste') // 'liste' | 'form'
  const [draft, setDraft] = useState(newSeance())
  const [seanceOuverte, setSeanceOuverte] = useState(null)

  const handleSave = () => {
    if (!draft.date) return
    setSeances(prev => [draft, ...prev])
    setDraft(newSeance())
    setAfficher('liste')
  }

  const handleDelete = (id) => {
    setSeances(prev => prev.filter(s => s.id !== id))
    if (seanceOuverte === id) setSeanceOuverte(null)
  }

  const toggleObjectif = (id) => {
    setDraft(d => {
      const list = d.objectifsAbordes
      return {
        ...d,
        objectifsAbordes: list.includes(id) ? list.filter(x => x !== id) : [...list, id]
      }
    })
  }

  const duree = (s) => {
    if (!s.heureDebut || !s.heureFin) return null
    const [h1, m1] = s.heureDebut.split(':').map(Number)
    const [h2, m2] = s.heureFin.split(':').map(Number)
    const mins = (h2 * 60 + m2) - (h1 * 60 + m1)
    if (mins <= 0) return null
    return `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}`
  }

  // Compteurs
  const totalSeances = seances.length
  const totalKm = seances.reduce((s, x) => s + (parseInt(x.km) || 0), 0)

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Mes séances</h1>
          <p className="text-xs text-white/50 mt-0.5">
            {totalSeances} séance{totalSeances !== 1 ? 's' : ''} · {totalKm} km au total
          </p>
        </div>
        {afficher === 'liste' && (
          <button
            onClick={() => { setDraft(newSeance()); setAfficher('form') }}
            className="px-4 py-2 rounded-full text-xs font-extrabold transition-all active:scale-95"
            style={{ background: '#FFBE00', color: '#07111f' }}>
            + Séance
          </button>
        )}
      </div>

      {/* Formulaire nouvelle séance */}
      {afficher === 'form' && (
        <div className="rounded-2xl p-4 mb-4"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,190,0,0.25)' }}>
          <h2 className="text-sm font-extrabold text-white mb-4">Nouvelle séance</h2>

          {/* Date */}
          <Champ label="Date">
            <input type="date" value={draft.date}
                   onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
                   className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                   style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                   onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                   onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </Champ>

          {/* Heures */}
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

          {/* KM */}
          <Champ label="Kilométrage parcouru">
            <input type="number" inputMode="numeric" placeholder="ex: 35"
                   value={draft.km}
                   onChange={e => setDraft(d => ({ ...d, km: e.target.value }))}
                   className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                   style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                   onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                   onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </Champ>

          {/* Conditions météo */}
          <Champ label="Conditions de conduite">
            <input type="text" placeholder="ex: Nuit, pluie, autoroute…"
                   value={draft.conditions}
                   onChange={e => setDraft(d => ({ ...d, conditions: e.target.value }))}
                   className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                   style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                   onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                   onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </Champ>

          {/* Objectifs travaillés */}
          <Champ label="Objectifs travaillés (optionnel)">
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
              {OBJECTIFS_FLAT.map(o => {
                const sel = draft.objectifsAbordes.includes(o.id)
                return (
                  <button key={o.id} onClick={() => toggleObjectif(o.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all"
                          style={{
                            background: sel ? 'rgba(255,190,0,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${sel ? 'rgba(255,190,0,0.45)' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                    <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0"
                          style={{ background: sel ? '#FFBE00' : 'rgba(255,255,255,0.1)', color: '#07111f' }}>
                      {sel ? '✓' : ''}
                    </span>
                    <span className="text-[10px] font-bold text-white/40 shrink-0">{o.id}</span>
                    <span className="text-xs text-white/75 leading-snug">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </Champ>

          {/* Commentaire libre */}
          <Champ label="Notes libres">
            <textarea rows={3} placeholder="Points forts, difficultés, remarques de l'accompagnateur…"
                      value={draft.commentaire}
                      onChange={e => setDraft(d => ({ ...d, commentaire: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </Champ>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setAfficher('liste')}
                    className="flex-1 py-2.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
              Annuler
            </button>
            <button onClick={handleSave}
                    className="flex-1 py-2.5 rounded-full text-xs font-extrabold transition-all active:scale-95"
                    style={{ background: '#FFBE00', color: '#07111f' }}>
              ✅ Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Liste des séances */}
      {afficher === 'liste' && (
        <>
          {seances.length === 0 ? (
            <div className="text-center py-12 text-white/30">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-sm font-semibold">Aucune séance enregistrée</p>
              <p className="text-xs mt-1">Appuie sur + Séance pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {seances.map(s => {
                const isOpen = seanceOuverte === s.id
                const d = duree(s)
                return (
                  <div key={s.id} className="rounded-2xl overflow-hidden"
                       style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <button className="w-full px-4 py-3 flex items-center justify-between"
                            onClick={() => setSeanceOuverte(isOpen ? null : s.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-base"
                             style={{ background: 'rgba(255,190,0,0.12)', border: '1px solid rgba(255,190,0,0.25)' }}>
                          🚗
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">{formatDate(s.date)}</p>
                          <p className="text-xs text-white/40">
                            {d ? `${d} · ` : ''}{s.km ? `${s.km} km` : ''}{s.conditions ? ` · ${s.conditions}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className={`text-white/40 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-white/[0.06] pt-3 space-y-3">
                        {s.objectifsAbordes?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1.5">Objectifs travaillés</p>
                            <div className="flex flex-wrap gap-1.5">
                              {s.objectifsAbordes.map(id => (
                                <span key={id} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ background: 'rgba(255,190,0,0.15)', color: '#FFBE00', border: '1px solid rgba(255,190,0,0.35)' }}>
                                  {id}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {s.commentaire && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mb-1">Notes</p>
                            <p className="text-xs text-white/70 leading-relaxed">{s.commentaire}</p>
                          </div>
                        )}
                        <button onClick={() => handleDelete(s.id)}
                                className="text-xs text-red-400/60 hover:text-red-400 transition-colors">
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
