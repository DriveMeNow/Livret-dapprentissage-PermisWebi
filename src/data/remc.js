// Données officielles REMC — Référentiel pour l'Éducation à une Mobilité Citoyenne
// Source : Arrêté du 29 juillet 2013 relatif au livret d'apprentissage de la catégorie B
// Arrêté du 13 mai 2013 relatif au REMC — Légifrance

export const GROUPES_REMC = [
  {
    id: 'G1',
    titre: 'Maîtriser le maniement du véhicule dans un trafic faible ou nul',
    couleur: 'blue',
    emoji: '🚗',
    objectifs: [
      { id: 'C1a', label: 'Connaître les principaux organes et commandes du véhicule, effectuer des vérifications intérieures et extérieures' },
      { id: 'C1b', label: 'Entrer, s\'installer au poste de conduite et en sortir' },
      { id: 'C1c', label: 'Tenir, tourner le volant et maintenir la trajectoire' },
      { id: 'C1d', label: 'Démarrer et s\'arrêter' },
      { id: 'C1e', label: 'Doser l\'accélération et le freinage à diverses allures' },
      { id: 'C1f', label: 'Utiliser la boîte de vitesses' },
      { id: 'C1g', label: 'Diriger la voiture en avant en ligne droite et en courbe en adaptant allure et trajectoire' },
      { id: 'C1h', label: 'Regarder autour de soi et avertir' },
      { id: 'C1i', label: 'Effectuer une marche arrière et un demi-tour en sécurité' },
    ]
  },
  {
    id: 'G2',
    titre: 'Appréhender la route',
    couleur: 'purple',
    emoji: '🛣️',
    objectifs: [
      { id: 'C2a', label: 'Connaître les principales règles de circulation ainsi que la signalisation' },
      { id: 'C2b', label: 'Tenir compte de la signalisation verticale et horizontale' },
      { id: 'C2c', label: 'Rechercher les indices utiles' },
      { id: 'C2d', label: 'Utiliser toutes les commandes' },
      { id: 'C2e', label: 'Adapter sa vitesse aux situations' },
      { id: 'C2f', label: 'Choisir la voie de circulation' },
      { id: 'C2g', label: 'Maintenir les distances de sécurité' },
      { id: 'C2h', label: 'Franchir les différents types d\'intersection et y changer de direction' },
    ]
  },
  {
    id: 'G3',
    titre: 'Circuler dans des conditions difficiles et partager la route avec les autres usagers',
    couleur: 'orange',
    emoji: '⚠️',
    objectifs: [
      { id: 'C3a', label: 'Évaluer et maintenir les distances de sécurité' },
      { id: 'C3b', label: 'Croiser, dépasser, être dépassé' },
      { id: 'C3c', label: 'Passer des virages et conduire en déclivité' },
      { id: 'C3d', label: 'Connaître les caractéristiques des autres usagers et savoir se comporter avec respect et courtoisie à leur égard' },
      { id: 'C3e', label: 'S\'insérer, circuler et sortir d\'une voie rapide' },
      { id: 'C3f', label: 'Conduire dans une file de véhicules et dans une circulation dense' },
      { id: 'C3g', label: 'Conduire quand l\'adhérence et la visibilité sont réduites' },
    ]
  },
  {
    id: 'G4',
    titre: 'Pratiquer une conduite autonome, sûre et économique',
    couleur: 'green',
    emoji: '🌿',
    objectifs: [
      { id: 'C4a', label: 'Faire du véhicule un espace de vie agréable et maîtriser sa consommation' },
      { id: 'C4b', label: 'Connaître les règles relatives à la charge, au remorquage et à l\'attelage' },
      { id: 'C4c', label: 'Conduire sur une route à grande vitesse et en autoroute' },
      { id: 'C4d', label: 'Connaître les facteurs de risque : alcool, stupéfiants, médicaments, fatigue, téléphone' },
      { id: 'C4e', label: 'Réagir face à un accident, une panne ou une situation d\'urgence' },
      { id: 'C4f', label: 'Connaître les aides à la conduite et les nouvelles technologies embarquées' },
    ]
  }
]

// Correspondance couleurs Tailwind par groupe
export const COULEURS_GROUPE = {
  blue:   { bg: 'bg-blue-500/20',   border: 'border-blue-400/40',   text: 'text-blue-300',   dot: 'bg-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-400/40', text: 'text-purple-300', dot: 'bg-purple-400' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-400/40', text: 'text-orange-300', dot: 'bg-orange-400' },
  green:  { bg: 'bg-emerald-500/20',border: 'border-emerald-400/40',text: 'text-emerald-300',dot: 'bg-emerald-400' },
}

// États de validation
export const ETATS = {
  null:      { label: 'Non commencé', symbol: '',  couleur: 'text-pw-ink-soft/30' },
  aborde:    { label: 'Abordé',       symbol: '/', couleur: 'text-orange-400', bg: 'bg-orange-500', btnBg: 'bg-orange-500/20 border-orange-400/50 hover:bg-orange-500/40' },
  maitrise:  { label: 'Maîtrisé',     symbol: 'X', couleur: 'text-blue-400',  bg: 'bg-blue-500',   btnBg: 'bg-blue-500/20 border-blue-400/50 hover:bg-blue-500/40' },
  confirme:  { label: 'Confirmé',     symbol: '■', couleur: 'text-emerald-400',bg: 'bg-emerald-500',btnBg: 'bg-emerald-500/20 border-emerald-400/50 hover:bg-emerald-500/40' },
}
