// Onglet 2 — Mon livret / Compétences REMC (version Permis Webi)
import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, COULEURS, ETATS_PW, progressGroupe } from '../data/competences-pw'

export default function Competences({ groupeInitial }) {
  const [etats, setEtats] = useLocalStorage('pw_competences', {})
  const [groupeActif, setGroupeActif] = useState(groupeInitial || 'C1')
  const [scOuverte, setScOuverte] = useState(null)
  const [confirmLevel3, setConfirmLevel3] = useState(null) // { id, currentState }

  const groupe = COMPETENCES_PW.find(g => g.id === groupeActif)
  const c = COULEURS[groupe.couleur]

  const handleChangeEtat = (id, etatActuel) => {
    const next = (etatActuel + 1) % 4
    // Garde-fou anti-optimisme pour le niveau 3 (Maîtrisé)
    if (next === 3) {
      setConfirmLevel3({ id, etatActuel })
      return
    }
    setEtats(prev => ({ ...prev, [id]: next }))
  }

  const confirmerLevel3 = () => {
    if (!confirmLevel3) return
    setEtats(prev => ({ ...prev, [confirmLevel3.id]: 3 }))
    setConfirmLevel3(null)
  }

  const resetGroupe = () => {
    setEtats(prev => {
      const next = { ...prev }
      groupe.sousCompetences.forEach(sc => { next[sc.id] = 0 })
      return next
    })
  }

  const pct = progressGroupe(groupeActif, etats)

  return (
    <div className="h-full overflow-y-auto scrollbar-thin pb-6">

      {/* Sélecteur de groupe — onglets horizontaux */}
      <div className="flex gap-2 px-4 pt-4 pb-3 overflow-x-auto scrollbar-none">
        {COMPETENCES_PW.map(g => {
          const col = COULEURS[g.couleur]
          const isActive = g.id === groupeActif
          const pctG = progressGroupe(g.id, etats)
          return (
            <button key={g.id}
                    onClick={() => { setGroupeActif(g.id); setScOuverte(null) }}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl shrink-0 transition-all"
                    style={{
                      background: isActive ? col.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? col.border : 'rgba(255,255,255,0.08)'}`,
                      minWidth: '70px',
                    }}>
              <span className="text-base">{g.emoji}</span>
              <span className="text-[10px] font-bold text-white/70">{g.id}</span>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${pctG}%`, background: col.bar }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* En-tête du groupe actif */}
      <div className="mx-4 rounded-2xl p-4 mb-3"
           style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{groupe.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-extrabold text-white">{groupe.titre}</p>
              <span className="text-sm font-extrabold shrink-0" style={{ color: c.text }}>{pct}%</span>
            </div>
            <p className="text-[10px] text-white/50 mt-0.5">{groupe.sousTitre} · {groupe.poids}% du score total</p>
            <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: c.bar }} />
            </div>
          </div>
        </div>
        <p className="text-xs text-white/60 leading-relaxed mt-3 italic">{groupe.description}</p>
      </div>

      {/* Légende */}
      <div className="flex gap-2 px-4 mb-3 overflow-x-auto scrollbar-none">
        {Object.entries(ETATS_PW).map(([niveau, e]) => (
          <div key={niveau} className="flex items-center gap-1.5 shrink-0">
            <CarreEtat etat={parseInt(niveau)} size="sm" />
            <span className="text-[10px] text-white/50">{e.label}</span>
          </div>
        ))}
      </div>

      {/* Liste des sous-compétences */}
      <div className="px-4 space-y-2">
        {groupe.sousCompetences.map(sc => {
          const etatActuel = etats[sc.id] || 0
          const isOpen = scOuverte === sc.id
          return (
            <div key={sc.id} className="rounded-xl overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 px-3 py-3">
                {/* Carré état — tap pour changer */}
                <button onClick={() => handleChangeEtat(sc.id, etatActuel)}
                        className="shrink-0 transition-all active:scale-90">
                  <CarreEtat etat={etatActuel} size="md" />
                </button>
                {/* Label */}
                <button className="flex-1 text-left min-w-0"
                        onClick={() => setScOuverte(isOpen ? null : sc.id)}>
                  <p className="text-xs font-semibold text-white leading-snug">{sc.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{ETATS_PW[etatActuel].label}</p>
                </button>
                {/* Chevron description */}
                <button onClick={() => setScOuverte(isOpen ? null : sc.id)}
                        className="text-white/30 text-xs transition-transform duration-200 shrink-0"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  ▼
                </button>
              </div>
              {/* Description détaillée */}
              {isOpen && (
                <div className="px-3 pb-3 border-t border-white/[0.06] pt-2">
                  <p className="text-xs text-white/65 leading-relaxed">{sc.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Reset groupe */}
      <button onClick={resetGroupe}
              className="mx-4 mt-4 w-[calc(100%-2rem)] py-2 rounded-full text-xs text-white/25 hover:text-white/45 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        Remettre ce groupe à zéro
      </button>

      {/* Modal garde-fou level 3 */}
      {confirmLevel3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
             style={{ background: 'rgba(7,17,31,0.92)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
               style={{ background: 'linear-gradient(135deg, #0d1b3e, #07111f)', border: '1px solid rgba(255,190,0,0.3)' }}>
            <p className="text-base font-extrabold text-white mb-3">Es-tu sûr·e ?</p>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Valider une compétence en "Maîtrisé" trop tôt peut te donner une fausse confiance le jour de l'examen.
              Tu peux toujours revenir en arrière.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmLevel3(null)}
                      className="flex-1 py-2.5 rounded-full text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                Annuler
              </button>
              <button onClick={confirmerLevel3}
                      className="flex-1 py-2.5 rounded-full text-sm font-extrabold"
                      style={{ background: '#1d9e75', color: '#fff' }}>
                ✓ Maîtrisé !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Carré état visuel — 4 niveaux
export function CarreEtat({ etat = 0, size = 'md' }) {
  const dim = size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-7 h-7 text-xs'
  const e = {
    0: { bg: 'transparent',            border: 'rgba(255,255,255,0.2)',  symbol: '', color: 'transparent' },
    1: { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.6)',   symbol: '/', color: '#fb923c' },
    2: { bg: 'rgba(255,190,0,0.15)',   border: 'rgba(255,190,0,0.7)',    symbol: 'X', color: '#FFBE00' },
    3: { bg: 'rgba(29,158,117,0.25)',  border: 'rgba(29,158,117,0.7)',   symbol: '■', color: '#34d399' },
  }[etat] || { bg: 'transparent', border: 'rgba(255,255,255,0.2)', symbol: '', color: 'transparent' }

  return (
    <div className={`${dim} rounded flex items-center justify-center font-extrabold transition-all duration-200`}
         style={{ background: e.bg, border: `2px solid ${e.border}`, color: e.color }}>
      {e.symbol}
    </div>
  )
}
