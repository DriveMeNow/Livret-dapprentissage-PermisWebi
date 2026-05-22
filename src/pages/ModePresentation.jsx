// Mode présentation — Affichage officiel pour contrôle ou examen
// Fond blanc, lisibilité maximale, pas de navigation
import { COMPETENCES_PW, progressGroupe } from '../data/competences-pw'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function ModePresentation({ profil, photo, etats, seances, onQuitter }) {
  const dernSeance = seances[0] || null
  const pctGlobal = Math.round(
    COMPETENCES_PW.reduce((sum, g) => sum + (progressGroupe(g.id, etats) * g.poids / 100), 0)
  )

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ background: '#ffffff', color: '#0D0D0D', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Bouton quitter discret */}
      <button onClick={onQuitter}
              className="fixed top-4 right-4 z-10 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: '#f0f0f0', color: '#666' }}>
        ✕ Quitter
      </button>

      <div className="max-w-lg mx-auto px-5 py-8 pb-10">

        {/* Logo + Titre */}
        <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '2px solid #FFBE00' }}>
          <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
               alt="Permis Webi" className="w-12 h-12 rounded-full" style={{ border: '2px solid #FFBE00' }} />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#FFBE00' }}>Permis Webi</p>
            <p className="text-base font-extrabold text-gray-900">Livret d'apprentissage</p>
            <p className="text-[10px] text-gray-500">Candidat libre — Catégorie B</p>
          </div>
        </div>

        {/* Bloc 1 — Identité du candidat */}
        <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #FFBE00' }}>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">Candidat</p>
          <div className="flex gap-4">
            {photo && (
              <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid #ddd' }}>
                <img src={photo} alt="Photo" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-lg font-extrabold text-gray-900">
                {profil.prenom || '—'} {profil.nom?.toUpperCase() || ''}
              </p>
              {profil.dateNaissance && (
                <p className="text-xs text-gray-600">Né·e le {formatDate(profil.dateNaissance)}</p>
              )}
              {profil.adresse && (
                <p className="text-xs text-gray-600">{profil.adresse}</p>
              )}
              {profil.neph && (
                <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-bold"
                     style={{ background: 'rgba(255,190,0,0.15)', border: '1px solid rgba(255,190,0,0.5)', color: '#856404' }}>
                  NEPH : {profil.neph}
                </div>
              )}
              {profil.dateANTS && (
                <p className="text-[10px] text-gray-500">Dossier ANTS validé le {formatDate(profil.dateANTS)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bloc 2 — Progression des compétences */}
        <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #FFBE00' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Progression</p>
            <span className="text-sm font-extrabold" style={{ color: '#1d9e75' }}>{pctGlobal}% validé</span>
          </div>
          <div className="space-y-2.5">
            {COMPETENCES_PW.map(g => {
              const pct = progressGroupe(g.id, etats)
              const COLORS_PRINT = { blue: '#3b82f6', purple: '#a855f7', orange: '#f97316', green: '#1d9e75' }
              return (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{g.emoji} {g.titre}</span>
                    <span className="text-xs font-bold text-gray-600">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#e5e5e5' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS_PRINT[g.couleur] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bloc 3 — Dernière séance */}
        {dernSeance && (
          <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #FFBE00' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">Dernière séance validée</p>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{formatDate(dernSeance.date)}</p>
                <p className="text-xs text-gray-600">
                  {dernSeance.km ? `${dernSeance.km} km parcourus` : ''}
                  {dernSeance.lieu ? ` · ${dernSeance.lieu}` : ''}
                </p>
              </div>
            </div>
            {dernSeance.accompagnateur?.nom && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mb-0.5">Accompagnateur·rice</p>
                <p className="text-xs text-gray-700">
                  {dernSeance.accompagnateur.prenom} {dernSeance.accompagnateur.nom}
                  {dernSeance.accompagnateur.numeroPermis ? ` — Permis n° ${dernSeance.accompagnateur.numeroPermis}` : ''}
                </p>
              </div>
            )}
            {dernSeance.signature && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mb-1">Signature de l'accompagnateur·rice</p>
                <div className="p-2 rounded-lg inline-block" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                  <img src={dernSeance.signature} alt="Signature" className="h-12" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mentions légales */}
        <div className="text-center space-y-1">
          <p className="text-[10px] text-gray-500 font-semibold">
            Livret conforme au REMC — Arrêté du 29 juillet 2013
          </p>
          <p className="text-[10px] text-gray-400">
            Permis Webi · Marion Falquerho · SIREN 992 387 894<br />
            6 rue d'Armaille, 75017 Paris · permiswebi.fr
          </p>
        </div>
      </div>
    </div>
  )
}
