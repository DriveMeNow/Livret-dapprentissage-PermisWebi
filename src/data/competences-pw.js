// Données compétences — Référentiel REMC officiel (Arrêté du 29 juillet 2013)
// Labels et intitulés conformes au Référentiel pour l'Éducation à une Mobilité Citoyenne
// Cible : adultes candidats libres qui repassent après suspension/annulation/invalidation

export const POIDS_GROUPES = { C1: 35, C2: 30, C3: 25, C4: 10 }

export const COMPETENCES_PW = [
  {
    id: 'C1',
    numero: 1,
    titre: 'Maîtriser le véhicule',
    sousTitre: 'Trafic faible ou nul',
    couleur: 'blue',
    emoji: '🚗',
    poids: 35,
    description: "Tu as déjà conduit — l'objectif ici n'est pas d'apprendre de zéro, c'est de vérifier que les automatismes sont toujours là et de corriger les mauvaises habitudes qui ont pu s'installer. C'est dans ce groupe que les inspecteurs repèrent le plus vite si quelqu'un a vraiment la maîtrise ou s'il fait semblant.",
    sousCompetences: [
      {
        id: 'C1-1',
        label: "Connaître les organes et commandes, effectuer les vérifications",
        description: "Avant de prendre la route, tu dois pouvoir vérifier : niveau d'huile, liquide de refroidissement, pression des pneus, état des feux, niveau de carburant. L'inspecteur peut te demander d'ouvrir le capot et de montrer une vérification. Ce n'est pas une question piège — prépare-le.",
      },
      {
        id: 'C1-2',
        label: "Entrer, s'installer au poste de conduite et en sortir",
        description: "L'ordre compte : siège → volant → rétroviseurs → ceinture → avant de démarrer. L'inspecteur observe dès que tu t'assieds. Un siège mal réglé, des rétroviseurs non ajustés — ce sont des signaux qu'il note immédiatement.",
      },
      {
        id: 'C1-3',
        label: "Tenir, tourner le volant et maintenir la trajectoire",
        description: "Deux mains, à 9h15 ou 10h10. Le retour semi-glissé (laisser le volant revenir seul après un virage) est autorisé. Ce qui ne l'est pas : conduire à une main, poser le bras sur la portière, tenir le volant par le bas. C'est le défaut le plus fréquent chez les conducteurs expérimentés.",
      },
      {
        id: 'C1-4',
        label: "Démarrer et s'arrêter",
        description: "Démarrage : embrayage progressif, accélérateur dosé, pas de calage. Arrêt : anticipation du freinage, immobilisation propre. Si tu cales au démarrage de l'examen, ce n'est pas éliminatoire — mais ça installe un stress qui peut peser sur la suite.",
      },
      {
        id: 'C1-5',
        label: "Doser l'accélération et le freinage à diverses allures",
        description: "Un bon dosage, c'est anticiper — pas réagir dans l'urgence. Freinage progressif (pas de coup de frein brusque), accélération adaptée à la situation. L'inspecteur ressent chaque à-coup. Une conduite souple rassure, une conduite saccadée inquiète.",
      },
      {
        id: 'C1-6',
        label: "Utiliser la boîte de vitesses",
        description: "Diesel : passer le rapport avant 2 000 tr/min. Essence : avant 2 500 tr/min. Conduire en sur-régime ou en sous-régime (garder trop longtemps un rapport inadapté) est pénalisé. Pour les boîtes automatiques : connaître les positions D, N, P et les modes spécifiques.",
      },
      {
        id: 'C1-7',
        label: "Diriger la voiture en ligne droite et en courbe",
        description: "Maintenir une trajectoire régulière sans zigzaguer. En courbe : réduire la vitesse avant (pas pendant), adapter la position dans la voie, ne pas couper la ligne centrale. L'inspecteur observe si tu gères la trajectoire ou si tu la subis.",
      },
      {
        id: 'C1-8',
        label: "Regarder autour de soi et avertir",
        description: "Le balayage du regard est permanent : rétroviseur intérieur toutes les 5 à 8 secondes, rétroviseurs latéraux avant tout changement de direction. Avertir = klaxon si nécessaire (passage étroit, angle mort d'un autre conducteur) — pas systématiquement. Un conducteur qui ne regarde pas assez est le signal le plus inquiétant pour un inspecteur.",
      },
      {
        id: 'C1-9',
        label: "Effectuer une marche arrière et un demi-tour en sécurité",
        description: "Marche arrière : vitesse lente, regard porté vers l'arrière (tête tournée, pas seulement les yeux sur les rétroviseurs). Demi-tour : 3, 5 ou 7 temps selon la largeur. Toujours s'assurer que la voie est libre avant de commencer. Ce point est systématiquement demandé à l'examen.",
      },
    ]
  },
  {
    id: 'C2',
    numero: 2,
    titre: 'Appréhender la route',
    sousTitre: 'Conditions normales',
    couleur: 'purple',
    emoji: '🛣️',
    poids: 30,
    description: "C'est la compétence la plus riche en règles précises. Beaucoup de candidats libres se font piéger ici — pas parce qu'ils conduisent mal, mais parce qu'ils ont oublié des points de code. La priorité à droite, les giratoires, le stationnement : révise ces points en priorité avant l'examen.",
    sousCompetences: [
      {
        id: 'C2-1',
        label: "Rechercher la signalisation et les indices utiles",
        description: "Méthode PADA : Percevoir → Analyser → Décider → Agir. L'inspecteur observe si tu anticipes ou si tu réagis dans l'urgence. Regarder loin devant (pas juste le capot), identifier les panneaux avant de les passer — pas après. Un conducteur qui se retrouve toujours en réaction subit la route au lieu de la lire.",
      },
      {
        id: 'C2-2',
        label: "Positionner le véhicule et choisir la voie de circulation",
        description: "File de droite par défaut hors dépassement. Ne pas mordre sur les lignes. Positionnement centré dans la voie. Sur route étroite : se déporter légèrement à droite pour laisser de la place aux véhicules venant en face. En ville, anticiper la file correcte bien avant la prochaine intersection.",
      },
      {
        id: 'C2-3',
        label: "Adapter l'allure aux situations",
        description: "Les limitations de vitesse sont des plafonds, pas des consignes. 11 situations imposent une réduction (école, marché, chantier, brouillard, pluie, nuit...). L'inspecteur pénalise autant celui qui roule trop vite que celui qui crée des bouchons en roulant trop lentement sans raison.",
      },
      {
        id: 'C2-4',
        label: "Détecter et franchir les intersections selon le régime de priorité",
        description: "En l'absence de signalisation, tout véhicule venant de ta droite est prioritaire — dans toutes les rues sans panneau, y compris les petites. C'est le point éliminatoire le plus fréquent à l'examen. Un panneau Stop = arrêt complet obligatoire même si la route est libre. Cédez le passage = ralentis et cède si nécessaire.",
      },
      {
        id: 'C2-5',
        label: "Tourner à droite et à gauche en agglomération",
        description: "À droite : serrer à droite, vitesse réduite, priorité aux piétons sur le passage piétons. À gauche : angle mort gauche obligatoire, attendre que les deux sens soient dégagés, ne pas couper la trajectoire des véhicules en face, piétons prioritaires. Le clignotant s'active avant, pas pendant la manœuvre.",
      },
      {
        id: 'C2-6',
        label: "Franchir les ronds-points et carrefours à sens giratoire",
        description: "Cédez le passage à l'entrée = tu laisses passer les véhicules déjà engagés dans le giratoire. Tu n'es prioritaire que quand tu es à l'intérieur du rond-point. Clignotant droit avant de sortir — pas obligatoire légalement, mais fortement attendu à l'examen. Adapter sa vitesse à la taille du giratoire.",
      },
      {
        id: 'C2-7',
        label: "S'arrêter et stationner en épi, en bataille et en créneau",
        description: "Créneau : la manœuvre la plus demandée. Repères à connaître par rapport à l'espace et aux véhicules encadrants. Épi et bataille : manœuvre en marche avant ou arrière selon les marquages. Dans tous les cas : signaler, vérifier les angles morts, ne pas gêner la circulation. Le stationnement sur trottoir est interdit — toujours.",
      },
    ]
  },
  {
    id: 'C3',
    numero: 3,
    titre: 'Conditions difficiles',
    sousTitre: 'Partager la route',
    couleur: 'orange',
    emoji: '⚠️',
    poids: 25,
    description: "Ces situations paraissent évidentes parce que tu as déjà conduit. Mais l'examen teste ta maîtrise dans des conditions variées — autoroute, nuit, pluie, trafic dense. Chacune a ses règles propres. Et les autres usagers (piétons, vélos, motos) sont souvent le point faible des conducteurs qui ont longtemps conduit seuls.",
    sousCompetences: [
      {
        id: 'C3-1',
        label: "Évaluer et maintenir les distances de sécurité",
        description: "Règle des 2 secondes : choisir un repère fixe, laisser passer 2 secondes après le véhicule devant. Sur autoroute et par mauvais temps : multiplier par 2. Les losanges jaunes au sol indiquent les distances de sécurité recommandées. En cas de freinage d'urgence, c'est cet espace qui sauve.",
      },
      {
        id: 'C3-2',
        label: "Croiser, dépasser, être dépassé",
        description: "Dépasser : observation (angle mort + rétroviseurs) → écart latéral suffisant (1,50 m minimum en agglomération) → rabattement progressif une fois le véhicule doublé visible dans le rétroviseur intérieur. Ne jamais dépasser à l'approche d'un virage ou d'une crête. Être dépassé : maintenir son allure, ne pas accélérer.",
      },
      {
        id: 'C3-3',
        label: "Passer des virages et conduire en déclivité",
        description: "Réduire la vitesse avant le virage, pas pendant. En descente : moteur frein + freinage progressif, ne pas laisser la voiture s'emballer. En montée : ne pas changer de vitesse au milieu d'une rampe raide. Rester à droite dans les virages serrés pour laisser de la place aux véhicules croiseurs.",
      },
      {
        id: 'C3-4',
        label: "Se comporter avec respect envers les autres usagers",
        description: "Piétons : toujours prioritaires sur les passages piétons, même si le feu est vert pour toi. Cyclistes : 1,50 m d'écart en agglomération, 1 m hors agglomération — et ne jamais les coincer contre le trottoir. Deux-roues motorisés : angle mort fréquent, regarder deux fois avant tout changement de voie. Respect = sécurité.",
      },
      {
        id: 'C3-5',
        label: "S'insérer, circuler et sortir d'une voie rapide",
        description: "Insertion : accélérer sur la bretelle d'accès jusqu'à la vitesse de la circulation, angle mort obligatoire, clignotant maintenu jusqu'à l'insertion. Ne pas s'arrêter sur la voie d'accélération. Sortie : se rabattre à droite avant la sortie, freiner sur la bretelle — pas sur la voie principale. Réadapter l'allure à la signalisation.",
      },
      {
        id: 'C3-6',
        label: "Conduire dans une file de véhicules et en circulation dense",
        description: "Maintenir une distance de sécurité même au ralenti. Ne pas se laisser aspirer par le flot — un camion qui freine brusquement peut te surprendre. Anticiper les ralentissements. En ville, surveiller les deux-roues qui remontent les files. Ne jamais occuper le carrefour quand tu ne peux pas le dégager complètement.",
      },
      {
        id: 'C3-7',
        label: "Conduire quand l'adhérence et la visibilité sont réduites",
        description: "Pluie : vitesse réduite, distances doublées, feux de croisement si visibilité réduite. Aquaplaning : relâcher l'accélérateur, ne pas freiner, laisser la voiture reprendre contact. Nuit : feux de croisement en agglomération, feux de route hors agglomération (dès qu'on ne gêne pas). Brouillard : antibrouillard AR autorisé si visibilité < 50 m.",
      },
    ]
  },
  {
    id: 'C4',
    numero: 4,
    titre: 'Conduite autonome',
    sousTitre: 'Sûre et économique',
    couleur: 'green',
    emoji: '🌿',
    poids: 10,
    description: "La conduite autonome, c'est conduire comme si l'inspecteur n'était pas là. L'examen teste si tu sais prendre des décisions seul·e — choisir ta voie, gérer une erreur d'itinéraire, préparer un trajet. C'est souvent là que les candidats libres se démarquent positivement, car ils ont l'expérience de la route.",
    sousCompetences: [
      {
        id: 'C4-1',
        label: "Suivre un itinéraire de manière autonome",
        description: "L'inspecteur te donne un point de destination — tu te débrouilles. Ne te fie pas uniquement au GPS : il peut être faux, décalé ou coupé. Lire les panneaux, anticiper les embranchements, demander confirmation si le doute est réel. Se tromper de chemin ne pénalise pas — paniquer ou freiner brusquement à cause d'une hésitation, oui.",
      },
      {
        id: 'C4-2',
        label: "Préparer et effectuer un voyage longue distance",
        description: "Avant un long trajet : vérifications du véhicule (pneus, niveaux, plein de carburant), préparation de l'itinéraire, estimation du temps de conduite. Pauses recommandées toutes les 2 heures. Connaître les aires de repos, les péages, les règles autoroutières. La fatigue est la première cause d'accident longue distance.",
      },
      {
        id: 'C4-3',
        label: "Connaître les facteurs de risque et les recommandations",
        description: "Alcool : dès 0,2 g/L pour les permis probatoires (3 ans), 0,5 g/L ensuite. Fatigue : 3 secondes d'endormissement à 130 km/h = 110 m parcourus les yeux fermés. Téléphone en main : temps de réaction multiplié par 3. Médicaments : lire l'étiquette, les niveaux 2 et 3 interdisent de conduire. Ces chiffres, tu dois pouvoir les citer.",
      },
      {
        id: 'C4-4',
        label: "Adopter les bons comportements en cas d'accident",
        description: "Méthode PAS : Protéger → Alerter → Secourir. Protéger d'abord (triangle à 30 m minimum, gilet jaune, feux de détresse). Alerter ensuite (15 SAMU, 18 Pompiers, 17 Police ou 112). Secourir enfin : ne pas déplacer un blessé sauf danger immédiat, position latérale de sécurité si inconscient mais qui respire.",
      },
      {
        id: 'C4-5',
        label: "Faire l'expérience des aides à la conduite embarquées",
        description: "ABS (antiblocage) : ne jamais pomper la pédale, maintenir la pression. ESP (contrôle de trajectoire) : ne compense pas la vitesse excessive. Régulateur de vitesse : à désactiver par mauvais temps. Aide au freinage d'urgence : appuyer franchement sur la pédale. Ces systèmes aident — ils ne remplacent pas l'anticipation.",
      },
      {
        id: 'C4-6',
        label: "Avoir des notions d'entretien, de dépannage et d'urgence",
        description: "Pneu crevé : ne pas freiner brusquement, tenir le volant à deux mains, ralentir progressivement, se garer à droite, triangle + gilet. Batterie à plat : câbles de démarrage ou assistance. Surchauffe moteur : arrêter, ne pas ouvrir le bouchon du radiateur à chaud. Ces réflexes s'apprennent — pas le jour de la panne.",
      },
      {
        id: 'C4-7',
        label: "Pratiquer l'écoconduite",
        description: "Anticipation des décélérations (relâcher l'accélérateur tôt), montée en vitesse progressive, vitesse stabilisée. Pneus gonflés correctement = 0,5 L/100 km économisés. Climatisation = +1 L/100 km. En plus d'économiser du carburant, l'écoconduite réduit le stress et l'usure du véhicule — et c'est valorisé à l'examen.",
      },
    ]
  }
]

// Couleurs REMC officielles — Référentiel Éducation à une Mobilité Citoyenne
// C1 Bleu royal · C2 Magenta · C3 Orange · C4 Vert
export const COULEURS = {
  blue:   { bg: 'rgba(0,102,204,0.14)',  border: 'rgba(0,102,204,0.50)',  text: '#4dabff', bar: '#0066cc', solid: '#0066cc' },
  purple: { bg: 'rgba(230,0,126,0.14)',  border: 'rgba(230,0,126,0.50)',  text: '#ff77cc', bar: '#e6007e', solid: '#e6007e' },
  orange: { bg: 'rgba(255,153,0,0.14)',  border: 'rgba(255,153,0,0.50)',  text: '#ffbb55', bar: '#ff9900', solid: '#ff9900' },
  green:  { bg: 'rgba(0,153,51,0.14)',   border: 'rgba(0,153,51,0.50)',   text: '#33cc66', bar: '#009933', solid: '#009933' },
}

// États de compétence — 4 niveaux
export const ETATS_PW = {
  0: { label: 'Non abordé',             symbol: '',  couleur: 'rgba(255,255,255,0.2)',  bg: 'transparent',            border: 'rgba(255,255,255,0.2)' },
  1: { label: 'Abordé',                 symbol: '/', couleur: '#fb923c',               bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.5)' },
  2: { label: 'Traité (9 séances/10)',  symbol: 'X', couleur: '#FFBE00',               bg: 'rgba(255,190,0,0.15)',   border: 'rgba(255,190,0,0.6)' },
  3: { label: 'Maîtrisé',              symbol: '■', couleur: '#34d399',               bg: 'rgba(29,158,117,0.2)',   border: 'rgba(29,158,117,0.6)' },
}

// Calcul de la progression d'un groupe (0-100)
export function progressGroupe(groupeId, etats) {
  const groupe = COMPETENCES_PW.find(g => g.id === groupeId)
  if (!groupe) return 0
  const total = groupe.sousCompetences.length * 3 // max = 3 par sous-compétence
  const score = groupe.sousCompetences.reduce((sum, sc) => sum + (etats[sc.id] || 0), 0)
  return Math.round((score / total) * 100)
}

// Calcul de la progression globale pondérée (0-100)
export function progressGlobal(etats) {
  return Math.round(
    COMPETENCES_PW.reduce((sum, g) => {
      return sum + (progressGroupe(g.id, etats) * g.poids / 100)
    }, 0)
  )
}
