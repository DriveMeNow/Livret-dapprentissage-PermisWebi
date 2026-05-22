/**
 * Dashboard — Tableau de bord V1.3
 * Badges REMC officiels (C1-C4) + contraste textes + anneau SVG
 */
import { useLocalStorage } from '../hooks/useLocalStorage'
import { COMPETENCES_PW, COULEURS, progressGroupe, progressGlobal } from '../data/competences-pw'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

/** Anneau de progression circulaire SVG */
function ProgressRing({ pct }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const color = pct >= 80 ? '#009933' : pct >= 40 ? '#FFBE00' : '#fb923c'
  const glowColor = pct >= 80
    ? 'rgba(0,153,51,0.35)'
    : pct >= 40
    ? 'rgba(255,190,0,0.35)'
    : 'rgba(251,146,60,0.35)'

  return (
    <div className="relative w-32 h-32 mx-auto mb-3">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1), stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <img
          src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
          alt="Permis Webi"
          className="w-9 h-9 rounded-full animate-float"
          style={{ boxShadow: `0 0 12px ${glowColor}` }}
        />
        <span className="text-sm font-extrabold tabular-nums leading-none mt-0.5" style={{ color }}>
          {pct}%
        </span>
      </div>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const [profil] = useLocalStorage('pw_profil', {})
  const [etats] = useLocalStorage('pw_competences', {})
  const [seances] = useLocalStorage('pw_seances', [])

  const pctGlobal = progressGlobal(etats)
  const dernSeances = [...seances].slice(0, 3)
  const nephAffiche = profil.neph ? `****${profil.neph.slice(-4)}` : null
  const prenom = profil.prenom || ''
  const nom = profil.nom ? profil.nom.toUpperCase() : ''

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 pt-6 pb-6">

      {/* ── Hero — anneau + identité ───────────────── */}
      <div className="text-center mb-5 animate-fadeIn">
        <ProgressRing pct={pctGlobal} />
        {profil.nom ? (
          <div>
            <h1 className="text-base font-extrabold text-white leading-tight">
              {prenom}{prenom && nom ? ' ' : ''}<span style={{ color: '#FFBE00' }}>{nom}</span>
            </h1>
            {nephAffiche && (
              <p className="text-[10px] text-white/60 mt-0.5 font-mono tracking-wider">
                NEPH {nephAffiche}
              </p>
            )}
          </div>
        ) : (
          <button onClick={() => onNavigate('profil')}
                  className="text-sm font-bold text-white/80">
            👤 Complète ton profil →
          </button>
        )}
        <p className="text-[10px] text-white/55 mt-1.5 font-medium">
          {seances.length > 0
            ? `${seances.length} séance${seances.length > 1 ? 's' : ''} enregistrée${seances.length > 1 ? 's' : ''}`
            : 'Aucune séance pour l\'instant'}
        </p>
      </div>

      {/* ── 4 blocs compétences avec badges REMC ───── */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {COMPETENCES_PW.map((g, i) => {
          const pct = progressGroupe(g.id, etats)
          const c = COULEURS[g.couleur]
          const delay = `anim-delay-${Math.min(i + 1, 4)}`
          return (
            <button
              key={g.id}
              onClick={() => onNavigate('competences', g.id)}
              className={`rounded-2xl p-3.5 text-left card-hover tap-scale animate-fadeIn ${delay}`}
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              {/* Badge REMC + emoji + % */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white shrink-0"
                        style={{ background: c.solid }}>
                    {g.id}
                  </span>
                  <span className="text-base leading-none">{g.emoji}</span>
                </div>
                <span className="text-xs font-extrabold tabular-nums" style={{ color: c.text }}>
                  {pct}%
                </span>
              </div>
              <p className="text-[11px] font-bold text-white leading-tight mb-2.5">
                {g.titre}
              </p>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.09)' }}>
                <div className="h-full rounded-full progress-bar-fill"
                     style={{ width: `${pct}%`, background: c.bar }} />
              </div>
              <p className="text-[9px] mt-1.5 font-semibold" style={{ color: c.text, opacity: 0.8 }}>
                {g.poids}% du score global
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Boutons d'action ─────────────────────────── */}
      <div className="flex gap-2.5 mb-5 animate-fadeIn anim-delay-4">
        <button
          onClick={() => onNavigate('seances', 'new')}
          className="flex-1 py-3.5 rounded-full text-sm font-extrabold tap-scale glow-yellow"
          style={{ background: '#FFBE00', color: '#07111f' }}
        >
          ▶ Nouvelle séance
        </button>
        <button
          onClick={() => onNavigate('profil', 'presentation')}
          className="py-3.5 px-5 rounded-full text-sm font-bold tap-scale"
          style={{
            background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.20)',
            color: '#ffffff',
          }}
        >
          🪪 Contrôle
        </button>
      </div>

      {/* ── Dernières séances ───────────────────────── */}
      {dernSeances.length > 0 && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
              Dernières séances
            </p>
            <button onClick={() => onNavigate('seances')}
                    className="text-[10px] font-bold" style={{ color: '#FFBE00' }}>
              Voir tout →
            </button>
          </div>

          <div className="space-y-2">
            {dernSeances.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                   style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center text-base"
                     style={{ background: 'rgba(255,190,0,0.1)' }}>
                  🚗
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{formatDate(s.date)}</p>
                  <p className="text-[10px] text-white/60 truncate mt-0.5">
                    {s.km ? `${s.km} km` : ''}
                    {s.km && s.accompagnateur?.nom ? ' · ' : ''}
                    {s.accompagnateur?.nom ? `Avec ${s.accompagnateur.nom}` : ''}
                  </p>
                </div>
                {s.signature && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold"
                        style={{ background: 'rgba(0,153,51,0.2)', color: '#33cc66', border: '1px solid rgba(0,153,51,0.4)' }}>
                    ✓ Signé
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Alerte profil incomplet ───────────────── */}
      {!profil.nom && dernSeances.length === 0 && (
        <div className="mt-2 px-4 py-3.5 rounded-2xl text-center"
             style={{ background: 'rgba(255,190,0,0.07)', border: '1px solid rgba(255,190,0,0.18)' }}>
          <p className="text-xs text-white/80 leading-relaxed">
            Commence par{' '}
            <button onClick={() => onNavigate('profil')}
                    className="font-extrabold underline" style={{ color: '#FFBE00' }}>
              compléter ton profil
            </button>
            {' '}pour accéder au mode présentation accompagnateur.
          </p>
        </div>
      )}

      {/* ── Pied de page légal ─────────────────────── */}
      <p className="text-center text-[9px] text-white/40 mt-6 pb-1 leading-relaxed">
        Livret conforme au REMC — Arrêté du 29 juillet 2013<br />
        Permis Webi © 2026 — Marion Falquerho — SIREN 992 387 894
      </p>
    </div>
  )
}
