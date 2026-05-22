// Données compétences — Version Permis Webi (langage candidat libre, pas jargon REMC)
// Cible : adultes qui ont DÉJÀ conduit, qui repassent après suspension/annulation/invalidation

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
    description: "Tu as déjà fait tout ça. L'objectif ici n'est pas d'apprendre — c'est de vérifier que les automatismes sont toujours là, et de corriger les mauvaises habitudes qui ont pu s'installer. La plus fréquente : tenir le volant à une main. L'inspecteur retire des points systématiquement.",
    sousCompetences: [
      {
        id: 'C1-1',
        label: "S'installer au poste de conduite",
        description: "Siège, volant, rétroviseurs, ceinture — dans le bon ordre, avant de démarrer. L'inspecteur observe ça dès le départ. Un siège mal réglé trahit d'emblée une mauvaise habitude.",
      },
      {
        id: 'C1-2',
        label: "Démarrer et s'arrêter en souplesse",
        description: "Gestion de l'embrayage, dosage de l'accélérateur. Pas de à-coups, pas de calage. Si tu cales au démarrage de l'examen, ce n'est pas éliminatoire — mais ça stresse et ça donne une mauvaise impression.",
      },
      {
        id: 'C1-3',
        label: "Démarrer en côte",
        description: "Avec ou sans frein à main, sans reculer. Le démarrage en côte est systématiquement demandé à l'examen. Même sur une côte légère. Travaille-le jusqu'à ce que ce soit automatique.",
      },
      {
        id: 'C1-4',
        label: "Tenir le volant correctement",
        description: "Deux mains, à 9h15 ou 10h10. Le retour semi-glissé (laisser le volant revenir seul après un virage) est autorisé. Ce qui ne l'est pas : conduire à une main, poser le bras sur la portière, tenir le volant par le bas.",
      },
      {
        id: 'C1-5',
        label: "Contrôler, clignoter, agir — dans le bon ordre",
        description: "À chaque changement de direction : rétroviseur intérieur → rétroviseur latéral → clignotant → angle mort → action. Cet ordre est un point de contrôle systématique à l'examen.",
      },
      {
        id: 'C1-6',
        label: "Passer les vitesses au bon régime",
        description: "Diesel : montez le rapport avant 2 000 tr/min. Essence : avant 2 500 tr/min. Conduire en sur-régime ou en sous-régime (rater les rapports) est pénalisé comme défaut de maîtrise.",
      },
      {
        id: 'C1-7',
        label: "Marche arrière en ligne droite",
        description: "Vitesse lente, trajectoire contrôlée, regard porté vers l'arrière (pas sur les rétroviseurs uniquement). La tête qui tourne — pas juste les yeux.",
      },
      {
        id: 'C1-8',
        label: "Marche arrière en courbe",
        description: "La trajectoire suit la courbe sans mordre sur le trottoir ni s'éloigner excessivement. L'inspecteur peut demander d'effectuer un créneau ou une manœuvre de stationnement.",
      },
      {
        id: 'C1-9',
        label: "Demi-tour en sécurité",
        description: "3, 5 ou 7 temps selon la largeur de la rue. Toujours s'assurer que la route est dégagée avant de commencer. Ne jamais bloquer la circulation sans raison — si ce n'est pas faisable, passer son chemin.",
      },
    ]
  },
  {
    id: 'C2',
    numero: 2,
    titre: 'Appréhender la route',
    sousTitre: 'Circulation normale',
    couleur: 'purple',
    emoji: '🛣️',
    poids: 30,
    description: "C'est la compétence la plus riche en règles et en pièges. Beaucoup de candidats libres se plantent ici — pas parce qu'ils conduisent mal, mais parce qu'ils ont oublié des règles précises. La priorité à droite, les giratoires, les intersections : révise ces points en priorité.",
    sousCompetences: [
      {
        id: 'C2-1',
        label: "Rechercher la signalisation et les indices utiles",
        description: "Méthode PADA : Percevoir / Analyser / Décider / Agir. L'inspecteur observe si tu anticipes ou si tu réagis dans l'urgence. Anticiper = voir loin devant, pas juste le capot.",
      },
      {
        id: 'C2-2',
        label: "Se positionner correctement sur la chaussée",
        description: "File de droite par défaut hors dépassement. Ne pas mordre sur les lignes. Positionnement centré dans la voie. Sur route étroite : se déporter légèrement à droite pour laisser de la place.",
      },
      {
        id: 'C2-3',
        label: "Tourner à droite en sécurité",
        description: "Serrer à droite, vitesse réduite, priorité aux piétons sur le passage piétons. Ne jamais déboîter à droite depuis la file de gauche sauf indication.",
      },
      {
        id: 'C2-4',
        label: "Tourner à gauche en sécurité",
        description: "Angle mort gauche obligatoire. Attendre que la voie soit dégagée dans les deux sens. Ne pas couper la trajectoire des véhicules venant en face. Piétons prioritaires sur le passage.",
      },
      {
        id: 'C2-5',
        label: "Franchir un carrefour à sens giratoire",
        description: "Cédez le passage = tu t'arrêtes si nécessaire et tu laisses passer les véhicules déjà engagés. Les véhicules dans le giratoire sont prioritaires. Tu n'es prioritaire que quand tu es dans le rond-point.",
      },
      {
        id: 'C2-6',
        label: "Franchir un carrefour avec priorité à droite",
        description: "En l'absence de signalisation, tout véhicule venant de ta droite est prioritaire. C'est le point éliminatoire le plus fréquent. Il s'applique dans toutes les rues sans panneau — y compris les petites.",
      },
      {
        id: 'C2-7',
        label: "Adapter son allure à la situation",
        description: "11 situations réglementaires existent (école, marché, brouillard, pluie...). La vitesse maximale autorisée est un plafond, pas une consigne. Tu peux et dois rouler moins vite quand la situation l'impose.",
      },
      {
        id: 'C2-8',
        label: "Appliquer les règles aux feux tricolores",
        description: "Orange = freiner si tu peux le faire en sécurité, pas accélérer. Vert clignotant (rare en France, fréquent à l'étranger). Feu orange clignotant = priorité à droite en vigueur.",
      },
      {
        id: 'C2-9',
        label: "Maintenir les distances de sécurité",
        description: "Règle des 2 secondes : choisir un repère fixe, laisser passer 2 secondes après le véhicule devant. Sur autoroute et par mauvais temps : multiplier par 2. Les marques au sol (losanges) indiquent les distances à respecter.",
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
    description: "Ces situations te paraissent peut-être évidentes parce que tu as déjà conduit. Mais l'examen teste ta maîtrise dans des conditions variées — pas juste sur une route dégagée et ensoleillée. La voie rapide, la nuit, la pluie, la densité de circulation : chacune a ses règles propres.",
    sousCompetences: [
      {
        id: 'C3-1',
        label: "Dépasser en sécurité",
        description: "Observation (angle mort + rétroviseurs) / Écart latéral suffisant (1,50 m en agglomération) / Rabattement progressif une fois le véhicule doublé visible dans le rétroviseur intérieur. Ne jamais dépasser à l'approche d'un virage ou d'une crête.",
      },
      {
        id: 'C3-2',
        label: "Croiser correctement",
        description: "Serrer à droite pour laisser de la place. Sur route étroite, le premier arrivé n'est pas toujours prioritaire — c'est celui qui a la place qui passe. Ne jamais forcer le passage.",
      },
      {
        id: 'C3-3',
        label: "Gérer les virages et les déclivités",
        description: "Réduire la vitesse avant le virage (pas pendant). En descente : moteur frein + freinage progressif. En montée : ne pas changer de vitesse au milieu d'une rampe raide. Rester à droite dans les virages serrés.",
      },
      {
        id: 'C3-4',
        label: "S'insérer sur voie rapide",
        description: "Accélération sur la bretelle d'accès jusqu'à la vitesse de la circulation. Angle mort obligatoire. Clignotant maintenu jusqu'à l'insertion effective. Ne pas s'arrêter sur la voie d'accélération sauf urgence absolue.",
      },
      {
        id: 'C3-5',
        label: "Sortir de voie rapide",
        description: "Se rabattre à droite avant la sortie, pas au dernier moment. Freinage sur la bretelle de décélération uniquement — pas sur la voie principale. Réadapter son allure à la signalisation de sortie.",
      },
      {
        id: 'C3-6',
        label: "Circuler en trafic dense",
        description: "Maintenir une distance de sécurité même au ralenti. Ne pas se laisser aspirer par le flot. Anticiper les freinages. En ville, surveiller les deux-roues qui remontent les files entre les voitures.",
      },
      {
        id: 'C3-7',
        label: "Conduire par mauvais temps ou de nuit",
        description: "Pluie : vitesse réduite, distances doublées, feux allumés si visibilité réduite. Nuit : feux de croisement en agglomération, feux de route hors agglomération (dès qu'on ne gêne pas). Brouillard : antibrouillard AR autorisé si visibilité < 50 m.",
      },
      {
        id: 'C3-8',
        label: "Connaître et respecter les autres usagers",
        description: "Piétons : toujours prioritaires sur les passages piétons, même si le feu est vert. Cyclistes : 1,50 m d'écart en agglomération, 1 m hors agglomération. Deux-roues motorisés : angle mort fréquent — regarder deux fois avant de changer de voie.",
      },
      {
        id: 'C3-9',
        label: "Gérer les situations d'urgence",
        description: "Pneu crevé : ne pas freiner brusquement, tenir le volant des deux mains, ralentir progressivement. Aquaplaning : relâcher l'accélérateur, ne pas freiner, laisser le véhicule reprendre contact. Réflexes à connaître, pas à improviser.",
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
    description: "La conduite autonome, c'est conduire comme si l'inspecteur n'était pas là. L'examen teste si tu sais prendre des décisions seul·e — choisir ta voie, gérer une erreur d'itinéraire, lire la route sans être guidé·e à chaque seconde. C'est souvent là que les candidats libres se démarquent positivement.",
    sousCompetences: [
      {
        id: 'C4-1',
        label: "Suivre un itinéraire de façon autonome",
        description: "L'inspecteur te donne un point de destination, tu te débrouilles. Ne te fie pas uniquement au GPS — il peut être faux ou coupé. Lire les panneaux, anticiper, demander confirmation si doute réel.",
      },
      {
        id: 'C4-2',
        label: "Gérer une erreur d'itinéraire sans danger",
        description: "Se tromper de chemin ne pénalise pas à l'examen — gérer le stress ou freiner brusquement à cause d'une hésitation, oui. Calme, signalez, trouvez une solution sûre. Ne jamais faire de marche arrière sur route.",
      },
      {
        id: 'C4-3',
        label: "Respecter le marquage et la signalisation en autonomie",
        description: "Sans co-pilote qui guide, c'est toi qui gères. Marquage au sol, panneaux, priorités : tout doit être respecté même quand personne ne te dit quoi faire.",
      },
      {
        id: 'C4-4',
        label: "Prendre ses informations — Quand, Comment, Pourquoi",
        description: "Observer avant d'agir. Savoir QUAND regarder (avant de freiner, avant de tourner), COMMENT (balayage des yeux, pas fixation), POURQUOI (anticiper, pas réagir). L'auto-évaluation de ce point est difficile — demande à ton accompagnateur·rice d'observer.",
      },
      {
        id: 'C4-5',
        label: "Connaître les facteurs de risque",
        description: "Alcool : dès 0,2 g/L pour les permis probatoires. Fatigue : 3 secondes d'endormissement à 130 km/h = 110 m parcourus. Téléphone en main : multiplication du temps de réaction par 3. Ces chiffres, tu dois pouvoir les citer.",
      },
      {
        id: 'C4-6',
        label: "Réagir face à un accident (PAS)",
        description: "Protéger / Alerter / Secourir — dans cet ordre. Protéger d'abord (triangle, gilet). Alerter ensuite (15, 18 ou 112). Secourir enfin (position latérale de sécurité si inconscient et respire).",
      },
      {
        id: 'C4-7',
        label: "Connaître les aides à la conduite embarquées",
        description: "ABS (antiblocage), ESP (contrôle de trajectoire), régulateur de vitesse, aide au freinage d'urgence. Ces systèmes aident — ils ne remplacent pas l'anticipation. L'inspecteur peut en parler.",
      },
      {
        id: 'C4-8',
        label: "Pratiquer l'écoconduite",
        description: "Anticipation des décélérations (relâcher l'accélérateur tôt), montée en vitesse progressive, vitesse stabilisée. En plus d'économiser du carburant, l'écoconduite réduit le stress — moins d'à-coups = moins de fatigue.",
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
  0: { label: 'Non abordé',          symbol: '',  couleur: 'rgba(255,255,255,0.2)',  bg: 'transparent',            border: 'rgba(255,255,255,0.2)' },
  1: { label: 'Abordé',              symbol: '/',  couleur: '#fb923c',               bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.5)' },
  2: { label: 'Traité (9 séances/10)', symbol: 'X', couleur: '#FFBE00',              bg: 'rgba(255,190,0,0.15)',   border: 'rgba(255,190,0,0.6)' },
  3: { label: 'Maîtrisé',            symbol: '■',  couleur: '#34d399',               bg: 'rgba(29,158,117,0.2)',   border: 'rgba(29,158,117,0.6)' },
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
