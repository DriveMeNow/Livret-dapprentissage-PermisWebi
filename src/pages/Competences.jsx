// Onglet 3 — Grille de compétences REMC
// TON : officiel et pédagogique — données REMC verbatim

import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { GROUPES_REMC, COULEURS_GROUPE, ETATS } from '../data/remc'

export default function Competences() {
  const [etats, setEtats] = useLocalStorage('pw_competences', {})
  const [groupeOuvert, setGroupeOuvert] = useState('G1')

  const toggleEtat = (id) => {
    setEtats(prev => {
      const actuel = prev[id] || null
      const cycle = [null, 'aborde', 'maitrise', 'confirme']
      const idx = cycle.indexOf(actuel)
      const suivant = cycle[(idx + 1) % cycle.length]
      return { ...prev, [id]: suivant }
    })
  }

  const resetGroupe = (groupeId) => {
    const groupe = GROUPES_REMC.find(g => g.id === groupeId)
    if (!groupe) return
    setEtats(prev => {
      const next = { ...prev }
      groupe.objectifs.forEach(o => { next[o.id] = null })
      return next
    })
  }

  // Score global
  const totalObjectifs = GROUPES_REMC.reduce((sum, g) => sum + g.objectifs.length, 0)
  const confirmes = Object.values(etats).filter(v => v === 'confirme').length
  const abordes  = Object.values(etats).filter(v => v === 'aborde').length
  const maitrise = Object.values(etats).filter(v => v === 'maitrise').length
  const pct = Math.round((confirmes / totalObjectifs) * 100)

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-extrabold text-white">Mes compétences</h1>
        <p className="text-xs text-white/50 mt-1">29 objectifs REMC — appuie pour changer l'état</p>
      </div>

      {/* Barre de progression globale */}
      <div className="rounded-2xl p-4 mb-4"
           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white/70">Progression globale</span>
          <span className="text-sm font-extrabold" style={{ color: '#FFBE00' }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{ width: `${pct}%`, background: '#FFBE00' }} />
        </div>
        {/* Légende */}
        <div className="flex gap-3 mt-3 flex-wrap">
          <StatBadge couleur="orange" label="Abordé" count={abordes} symbol="/" />
          <StatBadge couleur="blue"   label="Maîtrisé" count={maitrise} symbol="X" />
          <StatBadge couleur="green"  label="Confirmé" count={confirmes} symbol="■" />
          <span className="text-xs text-white/40 ml-auto">{confirmes}/{totalObjectifs}</span>
        </div>
      </div>

      {/* Légende des états */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { etat: 'aborde',   label: 'Abordé' },
          { etat: 'maitrise', label: 'Maîtrisé' },
          { etat: 'confirme', label: 'Confirmé' },
        ].map(({ etat, label }) => (
          <div key={etat} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
               style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <SymboleEtat etat={etat} size="sm" />
            <span className="text-[10px] text-white/60">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-[10px] w-4 h-4 rounded flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}></span>
          <span className="text-[10px] text-white/60">Non commencé</span>
        </div>
      </div>

      {/* Groupes REMC */}
      {GROUPES_REMC.map(groupe => {
        const c = COULEURS_GROUPE[groupe.couleur]
        const isOpen = groupeOuvert === groupe.id
        const objectifsGroupe = groupe.objectifs
        const confirmes_g = objectifsGroupe.filter(o => etats[o.id] === 'confirme').length
        const pct_g = Math.round((confirmes_g / objectifsGroupe.length) * 100)

        return (
          <div key={groupe.id} className="rounded-2xl mb-3 overflow-hidden"
               style={{ border: `1px solid rgba(255,255,255,0.09)`, background: 'rgba(255,255,255,0.03)' }}>

            {/* Header groupe */}
            <button
              className="w-full px-4 py-3 flex items-center gap-3 text-left"
              onClick={() => setGroupeOuvert(isOpen ? null : groupe.id)}>
              {/* Numéro */}
              <div className={`w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center text-xs font-extrabold ${c.text}`}
                   style={{ background: 'rgba(255,255,255,0.08)' }}>
                {groupe.id.replace('G', '')}
              </div>

              {/* Titre + barre mini */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-white leading-tight line-clamp-2 flex-1">{groupe.titre}</p>
                  <span className={`text-xs font-extrabold shrink-0 ${c.text}`}>{pct_g}%</span>
                </div>
                <div className="w-full h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className={`h-full rounded-full transition-all duration-300 ${c.dot}`}
                       style={{ width: `${pct_g}%` }} />
                </div>
              </div>

              {/* Chevron */}
              <span className={`text-white/40 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Corps groupe */}
            {isOpen && (
              <div className="px-3 pb-3">
                <div className="space-y-1.5">
                  {objectifsGroupe.map(obj => {
                    const etatActuel = etats[obj.id] || null
                    return (
                      <button
                        key={obj.id}
                        onClick={() => toggleEtat(obj.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all active:scale-[0.98]"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {/* Symbole état */}
                        <SymboleEtat etat={etatActuel} size="md" />
                        {/* Libellé */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-white/40 mr-1">{obj.id}</span>
                          <span className="text-xs text-white/80 leading-snug">{obj.label}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Reset groupe */}
                <button
                  onClick={() => resetGroupe(groupe.id)}
                  className="mt-3 w-full py-1.5 rounded-full text-xs text-white/30 transition-all hover:text-white/50"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  Remettre à zéro ce groupe
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Note REMC */}
      <p className="text-center text-[10px] text-white/25 mt-2 pb-2">
        Référentiel REMC — Arrêté du 13 mai 2013
      </p>
    </div>
  )
}

// Symbole d'état (pastille + caractère)
function SymboleEtat({ etat, size = 'md' }) {
  const dim = size === 'sm' ? 'w-4 h-4 text-[9px]' : 'w-7 h-7 min-w-[28px] text-xs'

  if (!etat) {
    return (
      <div className={`${dim} rounded flex items-center justify-center`}
           style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }} />
    )
  }
  const map = {
    aborde:   { bg: 'rgba(249,115,22,0.2)',  border: 'rgba(249,115,22,0.5)',  color: '#fb923c', symbol: '/' },
    maitrise: { bg: 'rgba(59,130,246,0.2)',   border: 'rgba(59,130,246,0.5)',  color: '#60a5fa', symbol: 'X' },
    confirme: { bg: 'rgba(16,185,129,0.2)',   border: 'rgba(16,185,129,0.5)',  color: '#34d399', symbol: '■' },
  }
  const s = map[etat]
  return (
    <div className={`${dim} rounded flex items-center justify-center font-extrabold`}
         style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.symbol}
    </div>
  )
}

// Badge statistique
function StatBadge({ couleur, label, count, symbol }) {
  const colors = {
    orange: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#fb923c' },
    blue:   { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  text: '#60a5fa' },
    green:  { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  text: '#34d399' },
  }
  const c = colors[couleur]
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
         style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <span className="font-extrabold">{symbol}</span>
      <span>{count} {label}</span>
    </div>
  )
}
