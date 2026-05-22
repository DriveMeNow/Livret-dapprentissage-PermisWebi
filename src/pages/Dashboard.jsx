// Onglet 1 — Tableau de bord
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, COULEURS, progressGroupe, progressGlobal } from '../data/competences-pw'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

export default function Dashboard({ onNavigate }) {
  const [profil] = useLocalStorage('pw_profil', {})
  const [etats] = useLocalStorage('pw_competences', {})
  const [seances] = useLocalStorage('pw_seances', [])

  const pctGlobal = progressGlobal(etats)
  const dernSeances = [...seances].slice(0, 3)

  const nephAffiche = profil.neph
    ? `****${profil.neph.slice(-4)}`
    : '—'

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête candidat */}
      <div className="rounded-2xl p-4 mb-4"
           style={{ background: 'linear-gradient(135deg, rgba(13,27,62,0.9), rgba(7,17,31,0.9))', border: '1px solid rgba(255,190,0,0.3)' }}>
        <div className="flex items-center gap-3">
          <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
               alt="Permis Webi" className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: '#FFBE00' }}>Permis Webi</p>
            {profil.nom ? (
              <p className="text-base font-extrabold text-white truncate">
                {profil.prenom} {profil.nom?.toUpperCase()}
              </p>
            ) : (
              <p className="text-sm text-white/50">Complète ton profil pour commencer</p>
            )}
          </div>
          {profil.neph && (
            <div className="px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
                 style={{ background: 'rgba(255,190,0,0.15)', border: '1px solid rgba(255,190,0,0.4)', color: '#FFBE00' }}>
              NEPH {nephAffiche}
            </div>
          )}
        </div>

        {/* Progression globale */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60 font-semibold">Progression globale</span>
            <span className="text-sm font-extrabold" style={{ color: pctGlobal >= 80 ? '#34d399' : pctGlobal >= 40 ? '#FFBE00' : '#fb923c' }}>
              {pctGlobal}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-700"
                 style={{
                   width: `${pctGlobal}%`,
                   background: pctGlobal >= 80
                     ? 'linear-gradient(90deg, #1d9e75, #34d399)'
                     : pctGlobal >= 40
                     ? 'linear-gradient(90deg, #f97316, #FFBE00)'
                     : 'linear-gradient(90deg, #f97316, #fb923c)'
                 }} />
          </div>
          <p className="text-[10px] text-white/35 mt-1">
            {seances.length} séance{seances.length !== 1 ? 's' : ''} enregistrée{seances.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* 4 blocs compétences */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {COMPETENCES_PW.map(g => {
          const pct = progressGroupe(g.id, etats)
          const c = COULEURS[g.couleur]
          return (
            <button key={g.id}
                    onClick={() => onNavigate('competences', g.id)}
                    className="rounded-2xl p-3.5 text-left transition-all active:scale-[0.97]"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base">{g.emoji}</span>
                <span className="text-xs font-extrabold" style={{ color: c.text }}>{pct}%</span>
              </div>
              <p className="text-[11px] font-bold text-white leading-tight mb-2">{g.titre}</p>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${pct}%`, background: c.bar }} />
              </div>
              <p className="text-[9px] text-white/40 mt-1">{g.poids}% du score</p>
            </button>
          )
        })}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => onNavigate('seances', 'new')}
                className="flex-1 py-3 rounded-full text-sm font-extrabold transition-all active:scale-95"
                style={{ background: '#FFBE00', color: '#07111f' }}>
          ▶ Nouvelle séance
        </button>
        <button onClick={() => onNavigate('profil', 'presentation')}
                className="py-3 px-4 rounded-full text-sm font-bold transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
          🪪 Contrôle
        </button>
      </div>

      {/* Dernières séances */}
      {dernSeances.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-white/50">Dernières séances</p>
            <button onClick={() => onNavigate('seances')}
                    className="text-[10px] font-semibold" style={{ color: '#FFBE00' }}>
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            {dernSeances.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center text-sm"
                     style={{ background: 'rgba(255,190,0,0.1)' }}>
                  🚗
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{formatDate(s.date)}</p>
                  <p className="text-[10px] text-white/40 truncate">
                    {s.km ? `${s.km} km` : ''}{s.accompagnateur?.nom ? ` · Avec ${s.accompagnateur.nom}` : ''}
                  </p>
                </div>
                {s.signature && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(29,158,117,0.2)', color: '#34d399', border: '1px solid rgba(29,158,117,0.4)' }}>
                    ✓ Signé
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si profil vide */}
      {!profil.nom && (
        <div className="mt-4 px-4 py-3 rounded-xl text-center"
             style={{ background: 'rgba(255,190,0,0.08)', border: '1px solid rgba(255,190,0,0.2)' }}>
          <p className="text-xs text-white/60">
            👤 <button onClick={() => onNavigate('profil')} className="font-bold underline" style={{ color: '#FFBE00' }}>
              Complète ton profil
            </button> pour voir ton NEPH et accéder au mode présentation
          </p>
        </div>
      )}

      {/* Mention légale */}
      <p className="text-center text-[9px] text-white/20 mt-5 pb-1">
        Livret conforme au REMC — Arrêté du 29 juillet 2013<br />
        Permis Webi © 2026 — Marion Falquerho — SIREN 992 387 894
      </p>
    </div>
  )
}
