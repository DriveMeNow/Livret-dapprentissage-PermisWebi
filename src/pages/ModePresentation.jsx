// Mode présentation — Affichage officiel pour contrôle ou examen
// Fond blanc, lisibilité maximale, pas de navigation
import { COMPETENCES_PW, progressGroupe } from '../data/competences-pw'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

/** Miniature d'un document — image ou icône PDF */
function MiniDoc({ label, valeur }) {
  if (!valeur) return null
  const isImage = valeur.startsWith('data:image')
  return (
    <div className="flex items-start gap-3 mb-3">
      {isImage ? (
        <img src={valeur} alt={label}
             className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
             style={{ border: '1px solid #ddd' }} />
      ) : (
        <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
             style={{ background: '#f9f9f9', border: '1px solid #ddd' }}>
          📄
        </div>
      )}
      <div className="flex-1 min-w-0 pt-1">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-700 mb-0.5">{label}</p>
        <p className="text-xs font-semibold" style={{ color: '#1d9e75' }}>✓ Document fourni</p>
      </div>
    </div>
  )
}

export default function ModePresentation({ profil, photo, etats, seances, docs = {}, onQuitter }) {
  const dernSeance = seances[0] || null
  const pctGlobal = Math.round(
    COMPETENCES_PW.reduce((sum, g) => sum + (progressGroupe(g.id, etats) * g.poids / 100), 0)
  )

  const hasAnyDoc = Object.values(docs).some(Boolean)

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ background: '#ffffff', color: '#211C16', fontFamily: 'Inter, sans-serif' }}>

      {/* Bouton quitter discret */}
      <button onClick={onQuitter}
              className="fixed top-4 right-4 z-10 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: '#f0f0f0', color: '#666' }}>
        ✕ Quitter
      </button>

      <div className="max-w-lg mx-auto px-5 py-8 pb-10">

        {/* Logo + Titre */}
        <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '2px solid #B5863C' }}>
          <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
               alt="Permis Webi" className="w-12 h-12 rounded-full" style={{ border: '2px solid #B5863C' }} />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#B5863C' }}>Permis Webi</p>
            <p className="text-base font-extrabold text-gray-900">Livret d'apprentissage</p>
            <p className="text-[10px] text-gray-700">Candidat libre — Catégorie B</p>
          </div>
        </div>

        {/* Bloc 1 — Identité du candidat */}
        <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #B5863C' }}>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700 mb-3">Candidat</p>
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
                     style={{ background: 'rgba(181,134,60,0.15)', border: '1px solid rgba(181,134,60,0.5)', color: '#856404' }}>
                  NEPH : {profil.neph}
                </div>
              )}
              {profil.dateANTS && (
                <p className="text-[10px] text-gray-700">Dossier ANTS validé le {formatDate(profil.dateANTS)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bloc 2 — Documents obligatoires */}
        {hasAnyDoc && (
          <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #B5863C' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700 mb-4">
              Documents obligatoires
            </p>

            {docs.aipc && (
              <>
                <p className="text-[9px] font-extrabold uppercase tracking-wide text-gray-600 mb-2">Candidat</p>
                <MiniDoc label="AIPC ou récépissé de dépôt" valeur={docs.aipc} />
              </>
            )}

            {(docs.charte || docs.attestation || docs.permisRecto || docs.permisVerso) && (
              <>
                <p className="text-[9px] font-extrabold uppercase tracking-wide text-gray-600 mb-2 mt-3">Accompagnateur·rice</p>
                <MiniDoc label="Charte de l'accompagnateur"             valeur={docs.charte} />
                <MiniDoc label="Attestation sur l'honneur (lien parenté)" valeur={docs.attestation} />
                <MiniDoc label="Permis de conduire — Recto"              valeur={docs.permisRecto} />
                <MiniDoc label="Permis de conduire — Verso"              valeur={docs.permisVerso} />
              </>
            )}

            <p className="text-[9px] text-gray-600 mt-3 leading-relaxed italic">
              À présenter en cas de contrôle routier et le jour de l'examen pratique.
            </p>
          </div>
        )}

        {/* Bloc 3 — Progression des compétences */}
        <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #B5863C' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700">Progression REMC</p>
            <span className="text-sm font-extrabold" style={{ color: '#1d9e75' }}>{pctGlobal}% validé</span>
          </div>
          <div className="space-y-2.5">
            {COMPETENCES_PW.map(g => {
              const pct = progressGroupe(g.id, etats)
              const COLORS_PRINT = { blue: '#0066cc', purple: '#e6007e', orange: '#ff9900', green: '#009933' }
              return (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold text-pw-cream"
                            style={{ background: COLORS_PRINT[g.couleur] }}>{g.id}</span>
                      <span className="text-xs font-semibold text-gray-700">{g.emoji} {g.titre}</span>
                    </div>
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

        {/* Bloc 4 — Dernière séance */}
        {dernSeance && (
          <div className="mb-5 p-4 rounded-xl" style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderLeft: '4px solid #B5863C' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700 mb-3">Dernière séance validée</p>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{formatDate(dernSeance.date)}</p>
                <p className="text-xs text-gray-600">
                  {dernSeance.km ? `${dernSeance.km} km parcourus` : ''}
                  {dernSeance.villes?.length
                    ? ` · ${dernSeance.villes.join(', ')}`
                    : dernSeance.lieu ? ` · ${dernSeance.lieu}` : ''}
                </p>
              </div>
            </div>
            {dernSeance.accompagnateur?.nom && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-700 uppercase font-bold tracking-wide mb-0.5">Accompagnateur·rice</p>
                <p className="text-xs text-gray-700">
                  {dernSeance.accompagnateur.prenom} {dernSeance.accompagnateur.nom}
                  {dernSeance.accompagnateur.numeroPermis ? ` — Permis n° ${dernSeance.accompagnateur.numeroPermis}` : ''}
                </p>
              </div>
            )}
            {dernSeance.signature && (
              <div>
                <p className="text-[10px] text-gray-700 uppercase font-bold tracking-wide mb-1">Signature de l'accompagnateur·rice</p>
                <div className="p-2 rounded-lg inline-block" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                  <img src={dernSeance.signature} alt="Signature" className="h-12" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mentions légales */}
        <div className="text-center space-y-1">
          <p className="text-[10px] text-gray-700 font-semibold">
            Livret conforme au REMC — Arrêté du 29 juillet 2013
          </p>
          <p className="text-[10px] text-gray-600">
            Permis Webi · Marion Falquerho · SIREN 992 387 894<br />
            6 rue d'Armaille, 75017 Paris · permiswebi.fr
          </p>
        </div>
      </div>
    </div>
  )
}
