/**
 * Onglet Livret — Vue groupes (4 vignettes) puis vue sous-compétences
 * Navigation : groupeInitial fourni → ouvre directement le groupe (depuis Dashboard)
 *              groupeInitial null → vue groupes (depuis NavBar)
 */
import { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, COULEURS, ETATS_PW, progressGroupe } from '../data/competences-pw'

export default function Competences({ groupeInitial }) {
  const [etats, setEtats] = useLocalStorage('pw_competences', {})
  const [vueDetail, setVueDetail] = useState(groupeInitial || null)
  const [scOuverte, setScOuverte] = useState(null)
  const [confirmLevel3, setConfirmLevel3] = useState(null)
  const scRefs = useRef({})

  // Scroll vers le volet ouvert — useEffect garantit que le DOM est à jour
  // (fermeture de l'ancien volet + ouverture du nouveau traités avant le scroll)
  useEffect(() => {
    if (!scOuverte) return
    const timer = setTimeout(() => {
      scRefs.current[scOuverte]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(timer)
  }, [scOuverte])

  const toggleSc = (id, isCurrentlyOpen) => {
    setScOuverte(isCurrentlyOpen ? null : id)
  }

  const handleChangeEtat = (id, etatActuel) => {
    const next = (etatActuel + 1) % 4
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

  // ── VUE DÉTAIL D'UN GROUPE ─────────────────────────────────────
  if (vueDetail) {
    const groupe = COMPETENCES_PW.find(g => g.id === vueDetail)
    if (!groupe) { setVueDetail(null); return null }
    const c = COULEURS[groupe.couleur]
    const pct = progressGroupe(vueDetail, etats)

    const resetGroupe = () => {
      setEtats(prev => {
        const next = { ...prev }
        groupe.sousCompetences.forEach(sc => { next[sc.id] = 0 })
        return next
      })
    }

    return (
      <div className="h-full overflow-y-auto scrollbar-thin pb-6">

        {/* Bouton retour */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => { setVueDetail(null); setScOuverte(null) }}
            className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            ← Tous les groupes
          </button>
        </div>

        {/* En-tête du groupe */}
        <div className="mx-4 rounded-2xl p-4 mb-4"
             style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">{groupe.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold text-white shrink-0 mt-0.5"
                        style={{ background: c.solid }}>
                    {groupe.id}
                  </span>
                  <p className="text-sm font-extrabold text-white leading-snug">{groupe.titre}</p>
                </div>
                <span className="text-sm font-extrabold shrink-0 mt-0.5" style={{ color: c.text }}>{pct}%</span>
              </div>
              <p className="text-[10px] mt-0.5 text-white/70">
                {groupe.sousTitre}
              </p>
              <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-500 progress-bar-fill"
                     style={{ width: `${pct}%`, background: c.bar }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-white/65 leading-relaxed mt-3 italic">{groupe.description}</p>
        </div>

        {/* Légende des 4 états */}
        <div className="flex gap-4 px-4 mb-4 flex-wrap">
          {Object.entries(ETATS_PW).map(([niveau, e]) => (
            <div key={niveau} className="flex items-center gap-1.5">
              <CarreEtat etat={parseInt(niveau)} size="sm" />
              <span className="text-[10px] text-white/70">{e.label}</span>
            </div>
          ))}
        </div>

        {/* Liste des sous-compétences — sans préfixe */}
        <div className="px-4 space-y-2">
          {groupe.sousCompetences.map(sc => {
            const etatActuel = etats[sc.id] || 0
            const isOpen = scOuverte === sc.id
            return (
              <div key={sc.id}
                   ref={el => { scRefs.current[sc.id] = el }}
                   className="rounded-xl overflow-hidden"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 px-3 py-3">
                  {/* Carré état cliquable */}
                  <button
                    onClick={() => handleChangeEtat(sc.id, etatActuel)}
                    className="shrink-0 transition-all active:scale-90"
                  >
                    <CarreEtat etat={etatActuel} size="md" />
                  </button>
                  {/* Label (sans préfixe C1-1, C1-2…) */}
                  <button
                    className="flex-1 text-left min-w-0"
                    onClick={() => toggleSc(sc.id, isOpen)}
                  >
                    <p className="text-xs font-semibold text-white/90 leading-snug">{sc.label}</p>
                    <p className="text-[10px] text-white/50 mt-0.5">{ETATS_PW[etatActuel].label}</p>
                  </button>
                  {/* Chevron description */}
                  <button
                    onClick={() => toggleSc(sc.id, isOpen)}
                    className="text-xs transition-transform duration-200 shrink-0"
                    style={{ color: 'rgba(255,255,255,0.40)', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                  >
                    ▼
                  </button>
                </div>
                {isOpen && (
                  <div className="px-3 pb-4 border-t border-white/[0.06] pt-3 space-y-4">
                    {/* CE QUE L'INSPECTEUR ATTEND */}
                    {sc.contenu?.inspecteur && (
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: c.text }}>
                          Ce que l'inspecteur attend
                        </p>
                        <p className="text-xs text-white/70 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                          {sc.contenu.inspecteur}
                        </p>
                      </div>
                    )}
                    {/* EXERCICE AVEC TON ACCOMPAGNATEUR */}
                    {sc.contenu?.exercice && (
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: '#4ade80' }}>
                          Exercice avec ton accompagnateur
                        </p>
                        <p className="text-xs text-white/70 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                          {sc.contenu.exercice}
                        </p>
                      </div>
                    )}
                    {/* MAUVAISES HABITUDES À PERDRE */}
                    {sc.contenu?.habitudes?.length > 0 && (
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: '#fb923c' }}>
                          Mauvaises habitudes à perdre
                        </p>
                        <ul className="space-y-1">
                          {sc.contenu.habitudes.map((h, i) => (
                            <li key={i} className="flex gap-2 text-xs text-white/70 leading-relaxed">
                              <span className="shrink-0 mt-0.5" style={{ color: '#fb923c' }}>•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* BOUTON QUESTIONS DE VÉRIFICATION (C1-1 uniquement) */}
                    {sc.contenu?.boutonQuestions && (
                      <a
                        href="https://www.permiswebi.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tap-scale"
                        style={{
                          background: 'rgba(255,190,0,0.10)',
                          border: '1px solid rgba(255,190,0,0.30)',
                          color: '#FFBE00',
                          textDecoration: 'none',
                        }}
                      >
                        📚 Voir toutes les questions de vérification et de premiers secours →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Remise à zéro du groupe */}
        <button
          onClick={resetGroupe}
          className="mx-4 mt-4 w-[calc(100%-2rem)] py-2 rounded-full text-xs transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.30)' }}
        >
          Remettre ce groupe à zéro
        </button>

        {/* Modal garde-fou niveau 3 */}
        {confirmLevel3 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
               style={{ background: 'rgba(7,17,31,0.92)' }}>
            <div className="w-full max-w-sm rounded-2xl p-6 animate-scaleIn"
                 style={{ background: 'linear-gradient(135deg, #0d1b3e, #07111f)', border: '1px solid rgba(255,190,0,0.3)' }}>
              <p className="text-base font-extrabold text-white mb-3">Es-tu sûr·e ?</p>
              <p className="text-sm text-white/75 leading-relaxed mb-5">
                Valider une compétence en "Maîtrisé" trop tôt peut te donner une fausse confiance le jour de l'examen.
                Tu peux toujours revenir en arrière.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmLevel3(null)}
                  className="flex-1 py-2.5 rounded-full text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmerLevel3}
                  className="flex-1 py-2.5 rounded-full text-sm font-extrabold"
                  style={{ background: '#1d9e75', color: '#fff' }}
                >
                  ✓ Maîtrisé !
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── VUE GROUPES — 4 grandes vignettes empilées ─────────────────
  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      <h1 className="text-xl font-extrabold text-white mb-1">Mon livret</h1>
      <p className="text-xs text-white/60 mb-5">
        Appuie sur un groupe pour évaluer tes compétences
      </p>

      <div className="space-y-3">
        {COMPETENCES_PW.map((g, i) => {
          const pct = progressGroupe(g.id, etats)
          const c = COULEURS[g.couleur]
          const nbMaitrises = g.sousCompetences.filter(sc => (etats[sc.id] || 0) === 3).length
          const nbTraites   = g.sousCompetences.filter(sc => (etats[sc.id] || 0) === 2).length
          const nbAbordes   = g.sousCompetences.filter(sc => (etats[sc.id] || 0) === 1).length
          const nbTotal     = g.sousCompetences.length
          const aucun       = nbMaitrises === 0 && nbTraites === 0 && nbAbordes === 0

          return (
            <button
              key={g.id}
              onClick={() => { setVueDetail(g.id); setScOuverte(null) }}
              className={`w-full rounded-2xl p-4 text-left card-hover tap-scale animate-fadeIn anim-delay-${Math.min(i + 1, 4)}`}
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              {/* Ligne titre avec badge REMC — sans emoji */}
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-white shrink-0"
                          style={{ background: c.solid }}>
                      {g.id}
                    </span>
                    <p className="text-base font-extrabold text-white leading-snug">{g.titre}</p>
                  </div>
                  <span className="text-base font-extrabold shrink-0 mt-0.5" style={{ color: c.text }}>{pct}%</span>
                </div>
                <p className="text-[10px] mt-1 text-white/65 pl-0.5">
                  {g.sousTitre}
                </p>
              </div>

              {/* Barre de progression */}
              <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full progress-bar-fill"
                     style={{ width: `${pct}%`, background: c.bar }} />
              </div>

              {/* Compteurs + CTA */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 flex-wrap">
                  {nbMaitrises > 0 && (
                    <span className="text-[10px] font-semibold" style={{ color: '#34d399' }}>
                      ■ {nbMaitrises} maîtrisé{nbMaitrises > 1 ? 's' : ''}
                    </span>
                  )}
                  {nbTraites > 0 && (
                    <span className="text-[10px] font-semibold" style={{ color: '#FFBE00' }}>
                      X {nbTraites} traité{nbTraites > 1 ? 's' : ''}
                    </span>
                  )}
                  {nbAbordes > 0 && (
                    <span className="text-[10px] font-semibold" style={{ color: '#fb923c' }}>
                      / {nbAbordes} abordé{nbAbordes > 1 ? 's' : ''}
                    </span>
                  )}
                  {aucun && (
                    <span className="text-[10px] text-white/45">
                      {nbTotal} compétences à évaluer
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold shrink-0" style={{ color: c.text }}>
                  Ouvrir →
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Carré état visuel — 4 niveaux (exporté pour Seances.jsx) ──────
export function CarreEtat({ etat = 0, size = 'md' }) {
  const dim = size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-7 h-7 text-xs'
  const e = {
    0: { bg: 'transparent',             border: 'rgba(255,255,255,0.22)', symbol: '',  color: 'transparent' },
    1: { bg: 'rgba(249,115,22,0.15)',   border: 'rgba(249,115,22,0.6)',   symbol: '/', color: '#fb923c' },
    2: { bg: 'rgba(255,190,0,0.15)',    border: 'rgba(255,190,0,0.7)',    symbol: 'X', color: '#FFBE00' },
    3: { bg: 'rgba(29,158,117,0.25)',   border: 'rgba(29,158,117,0.7)',   symbol: '■', color: '#34d399' },
  }[etat] || { bg: 'transparent', border: 'rgba(255,255,255,0.22)', symbol: '', color: 'transparent' }

  return (
    <div
      className={`${dim} rounded flex items-center justify-center font-extrabold transition-all duration-200`}
      style={{ background: e.bg, border: `2px solid ${e.border}`, color: e.color }}
    >
      {e.symbol}
    </div>
  )
}
