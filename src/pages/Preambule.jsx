// Onglet 1 — Préambule réglementaire
// TON : officiel et neutre — texte REMC verbatim

export default function Preambule() {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3"
             style={{ background: 'rgba(255,190,0,0.15)', border: '1px solid rgba(255,190,0,0.4)', color: '#FFBE00' }}>
          Préambule réglementaire
        </div>
        <h1 className="text-xl font-extrabold text-white leading-tight">
          Livret d'apprentissage<br />
          <span style={{ color: '#FFBE00' }}>Permis B</span>
        </h1>
        <p className="text-xs text-white/50 mt-2">
          Référentiel pour l'Éducation à une Mobilité Citoyenne (REMC)<br />
          Arrêté du 13 mai 2013 — Ministère de l'Intérieur
        </p>
      </div>

      {/* Bloc 1 — Objet du livret */}
      <Section titre="Objet du livret" emoji="📄">
        <p>
          Le présent livret d'apprentissage est établi conformément à l'arrêté du 29 juillet 2013 relatif
          au livret d'apprentissage de la catégorie B du permis de conduire et au Référentiel pour
          l'Éducation à une Mobilité Citoyenne (REMC) défini par l'arrêté du 13 mai 2013.
        </p>
        <p className="mt-2">
          Il a pour objet de permettre le suivi de la progression du candidat dans l'acquisition
          des compétences nécessaires à la conduite d'un véhicule de la catégorie B dans des
          conditions de sécurité optimales.
        </p>
      </Section>

      {/* Bloc 2 — Conditions légales */}
      <Section titre="Conditions légales de la conduite accompagnée en candidat libre" emoji="⚖️">
        <p className="font-semibold text-white/90 mb-2">Véhicule :</p>
        <p>
          Le véhicule utilisé pour les séances d'entraînement doit être homologué et équipé
          d'une double commande de frein et d'embrayage. Il doit être assuré pour la conduite
          accompagnée ou la conduite supervisée.
        </p>

        <p className="font-semibold text-white/90 mt-3 mb-2">Accompagnateur :</p>
        <p>
          L'accompagnateur doit être titulaire du permis de conduire de la catégorie B depuis
          au moins cinq ans sans interruption au jour de la séance de conduite.
          Son permis ne doit pas avoir fait l'objet d'une annulation, d'une invalidation
          ou d'une suspension en cours de validité.
        </p>

        <p className="font-semibold text-white/90 mt-3 mb-2">Documents obligatoires à bord :</p>
        <ul className="list-none space-y-1 text-white/75">
          <li className="flex items-start gap-2"><span style={{ color: '#FFBE00' }}>—</span>Ce livret d'apprentissage</li>
          <li className="flex items-start gap-2"><span style={{ color: '#FFBE00' }}>—</span>Le permis de conduire de l'accompagnateur</li>
          <li className="flex items-start gap-2"><span style={{ color: '#FFBE00' }}>—</span>La pièce d'identité du candidat</li>
          <li className="flex items-start gap-2"><span style={{ color: '#FFBE00' }}>—</span>L'attestation d'assurance du véhicule couvrant la conduite accompagnée</li>
        </ul>
      </Section>

      {/* Bloc 3 — Statut du livret */}
      <Section titre="Statut du livret" emoji="ℹ️">
        <p>
          Ce livret numérique constitue un outil de suivi pédagogique. Il permet de tracer
          les séances de conduite réalisées et les compétences acquises conformément au REMC.
        </p>
        <p className="mt-2">
          Il peut être présenté à l'inspecteur lors de l'épreuve pratique du permis de conduire.
          Sa présentation est recommandée en cas de contrôle par les forces de l'ordre
          pendant les séances d'apprentissage.
        </p>
        <p className="mt-2 text-white/60 text-xs italic">
          La loi n'impose pas de quota minimal de séances ni de format obligatoire
          pour chaque entrée du livret. Son utilisation rigoureuse témoigne du
          sérieux de la démarche du candidat.
        </p>
      </Section>

      {/* Bloc 4 — Les 4 groupes REMC */}
      <Section titre="Programme REMC — 4 groupes de compétences" emoji="🎯">
        <p className="mb-3 text-white/70 text-xs">
          La formation au permis B s'articule autour de 4 groupes de compétences progressives,
          définis par le REMC, comportant 29 objectifs au total.
        </p>
        {[
          { num: 'G1', label: 'Maîtriser le maniement du véhicule dans un trafic faible ou nul', count: 9 },
          { num: 'G2', label: 'Appréhender la route', count: 8 },
          { num: 'G3', label: 'Circuler dans des conditions difficiles et partager la route avec les autres usagers', count: 7 },
          { num: 'G4', label: 'Pratiquer une conduite autonome, sûre et économique', count: 6 },
        ].map(g => (
          <div key={g.num} className="flex items-start gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
            <div className="w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center text-xs font-extrabold text-[#07111f]"
                 style={{ background: '#FFBE00' }}>
              {g.num.replace('G', '')}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{g.label}</p>
              <p className="text-xs text-white/50 mt-0.5">{g.count} objectifs</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Bas de page */}
      <p className="text-center text-[10px] text-white/30 mt-4 pb-2">
        Permis Webi © 2026 — Marion Falquerho<br />
        SIREN 992 387 894 — permiswebi.fr
      </p>

    </div>
  )
}

// Composant réutilisable pour les sections du préambule
function Section({ titre, emoji, children }) {
  return (
    <div className="rounded-2xl mb-4 p-4"
         style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <h2 className="text-xs font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color: '#FFBE00' }}>
        <span>{emoji}</span>
        {titre}
      </h2>
      <div className="text-sm text-white/75 leading-relaxed">
        {children}
      </div>
    </div>
  )
}
