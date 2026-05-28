// Données compétences — Référentiel REMC officiel (Arrêté du 29 juillet 2013)
// Labels et intitulés conformes au Référentiel pour l'Éducation à une Mobilité Citoyenne
// Cible : adultes candidats libres qui repassent après suspension/annulation/invalidation
// V1.12 — Contenu pédagogique complet (3 blocs par sous-compétence)

export const POIDS_GROUPES = { C1: 35, C2: 30, C3: 25, C4: 10 }

export const COMPETENCES_PW = [
  // ── COMPÉTENCE 1 ──────────────────────────────────────────────────
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
        label: "Connaître les principaux organes et commandes du véhicule, effectuer les vérifications intérieures et extérieures",
        contenu: {
          inspecteur: "Que tu répondes sans hésiter aux 3 questions de vérification : une vérification technique (intérieure ou extérieure), une question de sécurité routière, une question de premiers secours. Il veut aussi que tu localises instantanément n'importe quelle commande sans regarder tes doigts.",
          exercice: "À l'arrêt moteur éteint, demande-lui de te lancer des ordres rapides : \"Actionne les essuie-glaces arrière\", \"Allume les feux de brouillard avant\", \"Enclenche le dégivrage\". Tu dois poser tes mains dessus sans hésiter. Ouvrez aussi le capot ensemble : entraîne-toi à pointer et nommer les éléments extérieurs qui font partie des questions de vérifications.",
          habitudes: [
            "Répondre aux questions de vérification en tâtonnant ou en restant muet.",
            "Ne jamais avoir révisé les questions avant l'examen — tu risques de perdre 3 points.",
          ],
          boutonQuestions: true,
        },
      },
      {
        id: 'C1-2',
        label: "Entrer, s'installer au poste de conduite et en sortir",
        contenu: {
          inspecteur: "Une installation méthodique dans cet ordre :\nSiège : hauteur, distance par rapport aux pédales, inclinaison du dossier, appuie-tête\nVolant : hauteur, profondeur\nRétroviseurs : intérieur puis extérieurs\nCeinture\nIl observe dès que tu t'assieds. Un siège mal réglé, des rétroviseurs non ajustés sont notés immédiatement. Pour la sortie : contrôle de l'angle mort avant d'ouvrir la portière.",
          exercice: "Applique cet ordre avant chaque départ, sans exception. Pour la sortie, ouvre la portière avec ta main droite : ce geste force ton buste à pivoter et tes yeux à regarder dans l'angle mort gauche, protégeant les cyclistes. Ton accompagnateur vérifie l'ordre et la méthode à chaque séance.",
          habitudes: [
            "S'asseoir, mettre la ceinture et démarrer sans régler quoi que ce soit.",
            "Régler les rétroviseurs après avoir démarré, en roulant.",
            "Oublier l'appuie-tête (risque de traumatisme cervical en cas de choc arrière).",
            "Ouvrir la portière sans regarder dans l'angle mort (danger pour les cyclistes).",
            "Pousser le siège si loin qu'on ne peut pas freiner à fond jambes tendues.",
          ],
        },
      },
      {
        id: 'C1-3',
        label: "Tenir, tourner le volant et maintenir la trajectoire",
        contenu: {
          inspecteur: "Position des mains à \"9h15\" ou \"10h10\". Il vérifie que tu utilises les bonnes techniques selon la situation :\n- Tiré-glissé : une main tire le volant vers le bas pendant que l'autre glisse vers le haut pour prendre le relais — virages larges et trajectoires continues.\n- Chevauchement : une main attrape le volant plus haut pendant que l'autre accompagne le mouvement — virages serrés et manœuvres.\n- Retour glissé : après un virage, laisser le volant revenir naturellement entre les mains — évite les mouvements brusques au retour.\nAucun mouvement brusque dans les trois cas. La voiture doit rester stable et centrée dans la voie en permanence.",
          exercice: "Dans un grand parking vide, entraîne-toi à faire des virages serrés en chevauchant les mains : une main tracte pendant que l'autre va la chercher plus haut pour prendre le relais. Ton accompagnateur traque deux défauts : les mains crispées en haut du volant, et les bras qui se croisent en nœud sans relâcher le volant.",
          habitudes: [
            "Conduire à une main, le coude sur la fenêtre.",
            "Tenir le volant par le bas (position 6h) — peu de contrôle.",
            "Croiser les bras sans relâcher — blocage total si on doit réagir vite.",
            "\"Rouler\" le volant entre les mains sans jamais les déplacer (perte de précision).",
            "Regarder le volant quand on tourne.",
          ],
        },
      },
      {
        id: 'C1-4',
        label: "Démarrer et s'arrêter",
        contenu: {
          inspecteur: "Un démarrage fluide et maîtrisé : d'abord un filet d'accélérateur, puis relâchement progressif de l'embrayage jusqu'au point de patinage — ce point où le moteur et la transmission commencent à s'engager — puis les deux synchronisés pour décoller sans à-coups ni caler.\nLe point de patinage : embrayage appuyé, on relève doucement la pédale jusqu'à entendre le moteur baisser légèrement de régime et sentir le véhicule qui \"retient\". C'est là qu'on ajoute l'accélérateur et qu'on relâche l'embrayage progressivement.\nPour l'arrêt : technique dégressif — appuyer fermement sur le frein dès le début pour casser la vitesse rapidement, puis relâcher progressivement la pression en approchant du point d'arrêt. Les passagers ne sentent aucune secousse. C'est l'inverse du progressif (qui commence doux et finit fort — et qui provoque le \"coup du lapin\" à l'arrêt).",
          exercice: "Sur terrain plat et calme, cherche ton point de patinage moteur arrêté : lève lentement la pédale d'embrayage jusqu'à ce que le moteur change de son et que tu sentes la voiture retenir. Reste à ce point quelques secondes, puis recommence. Une fois trouvé, ajoute un léger filet de gaz et lâche progressivement l'embrayage. Pour l'arrêt, ton accompagnateur pose la main sur son genou et doit sentir une décélération franche au début, puis un arrêt totalement doux à la fin.",
          habitudes: [
            "Lâcher l'embrayage trop vite sans accélération — le moteur cale.",
            "Mettre trop d'accélérateur et lâcher l'embrayage trop vite — la voiture bondit.",
            "Chercher le point de patinage à chaque démarrage sans jamais le mémoriser.",
            "Freiner progressivement (en appuyant de plus en plus fort) — donne une secousse à l'arrêt.",
            "Appuyer fort sur le frein jusqu'à la fin — l'arrêt est brutal et inconfortable.",
          ],
        },
      },
      {
        id: 'C1-5',
        label: "Doser l'accélération et le freinage à diverses allures",
        contenu: {
          inspecteur: "L'accélération doit être progressive dans presque toutes les situations — démarrage, reprise de vitesse, sortie de virage. Elle devient plus franche et décidée lors des insertions (voie rapide, giratoire) où il faut atteindre rapidement la vitesse du trafic.\nLe freinage est progressif dans tous les cas — on augmente la pression sur la pédale graduellement. Exception : l'arrêt définitif, où la technique est dégressif (voir point 4) pour éviter la secousse finale.",
          exercice: "Ton accompagnateur doit sentir la voiture glisser en douceur lors des accélérations normales, et ne jamais être projeté en avant lors des freinages. Pour travailler les insertions : cherchez une voie rapide peu chargée et entraîne-toi à accélérer franchement sur la voie d'insertion jusqu'à la vitesse du trafic, sans lever le pied à mi-parcours.",
          habitudes: [
            "Accélérer en \"à-coups\" — signe de mauvaise maîtrise de l'embrayage.",
            "Freiner par palliers (plusieurs pressions successives) au lieu d'une pression progressive et continue.",
            "Sur voie rapide : accélérer timidement sur la voie d'insertion et forcer les autres à freiner.",
          ],
        },
      },
      {
        id: 'C1-6',
        label: "Utiliser la boîte de vitesses (manuelle et automatique)",
        contenu: {
          inspecteur: "Boîte manuelle : passer les vitesses au bon moment — cohérence entre régime moteur, bruit et allure — sans jamais regarder le levier. Tes yeux restent sur la route.\nBoîte automatique : l'inspecteur vérifie que tu sais utiliser les modes D, N, P, R correctement, que tu ne mets pas le frein de parking pendant que tu roules, et que tu gardes le pied sur le frein à l'arrêt (une boîte auto en D avance seule si tu lâches le frein — le pied gauche ne sert à rien sur une boîte auto).",
          exercice: "Boîte manuelle — moteur éteint : entraîne-toi à passer les vitesses de la 1ère à la 5ème et la marche arrière les yeux fixés droit devant. En circulation, ton accompagnateur vérifie que ta tête ne baisse jamais vers le levier.\nBoîte automatique : entraîne-toi à t'arrêter, maintenir le frein appuyé, puis repartir. Apprends à utiliser le mode \"B\" ou \"L\" (frein moteur en descente) si ton véhicule en dispose.",
          habitudes: [
            "Regarder le levier de vitesse à chaque changement (boîte manuelle).",
            "Rester en sous-régime — le moteur peine et consomme plus.",
            "Garder la main sur le levier entre les changements (usure du synchroniseur).",
            "Rouler en sur-régime sans monter les rapports.",
            "Utiliser le pied gauche pour freiner en boîte auto (risque de double pédale par réflexe).",
            "Mettre le point neutre à chaque arrêt en boîte auto — inutile et dangereux.",
          ],
        },
      },
      {
        id: 'C1-7',
        label: "Diriger la voiture en ligne droite et en courbe en adaptant allure et trajectoire",
        contenu: {
          inspecteur: "Ligne droite : trajectoire stable et centrée dans la voie, regarder loin devant (pas le capot). En courbe : avoir terminé le freinage et engagé la bonne vitesse AVANT de tourner le volant. Le regard cherche la sortie de la courbe, du virage ou du tournant dès l'entrée.",
          exercice: "Chronologie stricte dans les virages : Frein → Bonne vitesse engagée → Regard sur la sortie → Volant. Ton accompagnateur doit ressentir une force centrifuge minimale. En ligne droite, regarde loin au centre de ta voie — ne regarde pas les lignes au sol, le trottoir ou près du capot.",
          habitudes: [
            "Avoir le regard vers le bas, le sol ou le capot — la voiture suit les yeux, on zigzague si on regarde trop bas.",
            "Freiner pendant le virage — déstabilise la voiture, anticipe et freine avant.",
            "Avoir une allure excessive qui fait perdre la trajectoire.",
            "Trop serrer à droite surtout lorsqu'on n'a pas une bonne visibilité.",
          ],
        },
      },
      {
        id: 'C1-8',
        label: "Regarder autour de soi et avertir",
        contenu: {
          inspecteur: "Un regard SYSTÉMATIQUEMENT mobile. Contrôles rétroviseurs intérieur et extérieurs toutes les 5 à 10 secondes même en ligne droite. Angle mort SYSTÉMATIQUE avant tout changement de direction ou de voie. Si l'angle mort a été fait un peu tôt, n'hésite pas à le refaire juste avant d'agir.\nPour les avertissements : le clignotant est utilisé à chaque manœuvre, bien à l'avance. Le klaxon est un outil d'urgence — il ne s'utilise pas pour signaler son mécontentement mais pour alerter d'un danger imminent.",
          exercice: "Avant chaque démarrage, changement de direction ou insertion : Rétro intérieur → Rétro extérieur → Angle mort. Si les contrôles ont été faits trop tôt, recommence l'angle mort juste avant d'agir. Ton accompagnateur doit voir ton profil tourner à chaque fois. S'il remarque plus de 10 secondes sans contrôle rétroviseur en ligne droite, il dit \"Rétros !\".",
          habitudes: [
            "Faire les contrôles uniquement quand on s'en souvient, pas de manière systématique.",
            "Faire l'angle mort \"pour la forme\" sans vraiment regarder.",
            "Faire l'angle mort trop tôt et ne pas le refaire juste avant d'agir.",
            "Klaxonner pour exprimer son énervement — l'inspecteur note le comportement.",
          ],
        },
      },
      {
        id: 'C1-9',
        label: "Effectuer une marche arrière et un demi-tour en sécurité",
        contenu: {
          inspecteur: "La sécurité lors de toute manœuvre repose sur trois piliers : regarder (vision directe prioritaire sur les rétroviseurs), aller lentement (vitesse d'homme qui marche), clignoter lors de tout déplacement.\nEn marche arrière : corps pivoté, bras droit sur le dossier du siège passager, regard direct par la lunette arrière. Les rétroviseurs servent à ajuster le cap — ils ne remplacent pas la vision directe. Réaliser une marche arrière uniquement aux rétroviseurs est une faute éliminatoire.\nPour le demi-tour : contrôles systématiques avant chaque phase, clignotant à chaque changement de sens, allure lente et maîtrisée.\nPour les entraînements : choisir un endroit sans visibilité réduite, sans marquage au sol interdisant la manœuvre, sans circulation susceptible d'être gênée.",
          exercice: "Entraîne-toi à faire de longues lignes droites en marche arrière, corps pivoté, regard direct. Pour le demi-tour, travaille l'enchaînement : marche avant clignotant droite → arrêt → marche arrière clignotant gauche → arrêt → marche avant clignotant droite. Gestion de l'allure : léger filet d'accélérateur (boîte manuelle) ou lâche juste le frein (boîte automatique) pour éviter les à-coups.",
          habitudes: [
            "Conduire toute la marche arrière aux rétroviseurs sans jamais regarder directement derrière.",
            "Tourner les roues à l'arrêt.",
            "Aller trop vite — une manœuvre se fait toujours à allure de piéton.",
            "Ne pas mettre le clignotant lors des déplacements en manœuvre.",
            "S'entraîner dans un endroit avec une ligne continue au milieu (infraction).",
          ],
        },
      },
    ],
  },

  // ── COMPÉTENCE 2 ──────────────────────────────────────────────────
  {
    id: 'C2',
    numero: 2,
    titre: 'Appréhender la route',
    sousTitre: 'Circuler dans des conditions normales',
    couleur: 'purple',
    emoji: '🛣️',
    poids: 30,
    description: "C'est la compétence la plus riche en règles précises. Beaucoup de candidats libres se font piéger ici — pas parce qu'ils conduisent mal, mais parce qu'ils ont oublié des points de code. La priorité à droite, les giratoires, le stationnement : révise ces points en priorité avant l'examen.",
    sousCompetences: [
      {
        id: 'C2-1',
        label: "Rechercher la signalisation et les indices utiles",
        contenu: {
          inspecteur: "Un regard mobile et haut — il observe tes yeux via le rétroviseur intérieur. Il est attentif à ton adaptation face aux différentes situations : une zone avec beaucoup de signalisation, d'intersections et de piétons sur les trottoirs demande une allure bien plus modérée et une lecture bien plus intense qu'une route dégagée avec peu d'informations. Ce n'est pas pareil et l'inspecteur le voit.",
          exercice: "Pratique la conduite commentée pendant 10 minutes : annonce tout ce que tu vois au loin — \"Panneau 30, je contrôle derrière moi, je lâche l'accélérateur\", \"Feu vert depuis longtemps, je me prépare à freiner s'il passe à l'orange, je contrôle mes rétros\". Si tu n'as pas le temps de tout verbaliser, c'est un signe que ton allure est trop rapide.",
          habitudes: [
            "Adapter sa vitesse uniquement aux panneaux de limitation, pas à la complexité de l'environnement.",
            "Voir un panneau mais ne rien faire — l'information vue mais non traitée ne sert à rien.",
            "Rouler à la même allure en ville bondée et sur route dégagée.",
            "Ne regarder qu'à l'avant sans chercher les informations latérales (sorties, entrées de propriété, carrefours masqués).",
          ],
        },
      },
      {
        id: 'C2-2',
        label: "Positionner le véhicule et choisir la voie de circulation",
        contenu: {
          inspecteur: "Le bon placement dépend de la configuration de la route :\n- Chaussée à double sens : coller à droite, laisser un espace équivalent à une portière ouverte avec les véhicules stationnés.\n- Chaussée à sens unique ou à plusieurs voies : se placer dans la voie qui correspond à sa direction.\n- Croisement à l'indonésienne : deux véhicules qui tournent à gauche se croisent nez à nez — obligatoire quand il y a un îlot central ou une signalisation spécifique. Sinon, tourner en passant derrière le véhicule.\n- Voies spécialisées : bus, vélo, taxi, covoiturage — accès interdit sauf indication contraire.",
          exercice: "Ton accompagnateur annonce la direction à l'avance. Vérifie que tu te places dans la bonne voie sans attendre le dernier moment. Pour le croisement à l'indonésienne : travaillez-le spécifiquement sur un carrefour où il s'applique.",
          habitudes: [
            "Rouler au milieu de la chaussée à double sens (occupe les deux voies).",
            "Se placer dans la mauvaise voie et changer au dernier moment (coup de volant dangereux).",
            "Emprunter les voies de bus \"juste pour avancer\" — contravention et mise en danger des bus.",
            "Serrer trop à droite et risquer un choc avec l'ouverture d'une portière d'une voiture stationnée.",
          ],
        },
      },
      {
        id: 'C2-3',
        label: "Adapter l'allure aux situations",
        contenu: {
          inspecteur: "Une vitesse cohérente avec l'environnement à chaque instant. L'inspecteur ne doit jamais avoir à te dire de ralentir. Quelques situations particulièrement observées : entrée dans une zone résidentielle ou scolaire, passage devant un arrêt de bus, approche d'un carrefour ou d'une intersection masquée.\n\nRisques d'une mauvaise adaptation :\n- Trop vite : distance de freinage insuffisante, incapacité à réagir à un danger imprévu — faute éliminatoire si on force un autre usager à freiner.\n- Trop lentement : gêne pour les autres usagers, tension dans le trafic, risque de refus de priorité involontaire.",
          exercice: "Mot-clé de ton accompagnateur : \"ANTICIPATION\". S'il doit intervenir verbalement sur ton allure, c'est que la situation n'a pas été vue à temps. L'objectif final : qu'il n'ait plus jamais besoin d'intervenir sur ta vitesse.",
          habitudes: [
            "Rouler toujours à la limite maximale autorisée quelle que soit la situation.",
            "Ralentir uniquement quand il y a un panneau, pas quand l'environnement l'exige.",
            "Accélérer dès que la voie est libre, sans regarder ce qui peut surgir.",
            "Sous-estimer le temps de réaction + distance de freinage à haute vitesse.",
          ],
        },
      },
      {
        id: 'C2-4',
        label: "Tourner à droite et à gauche en agglomération",
        contenu: {
          inspecteur: "Le mémo technique à appliquer systématiquement : CIA\nC — Contrôler : rétroviseur intérieur + rétroviseur extérieur du côté du tournant\nI — Informer : clignotant bien à l'avance (pas au dernier moment)\nA — Agir : refaire l'angle mort juste avant de tourner le volant\n\nPour le tournant à gauche : ne jamais couper le virage (franchissement de voie, mise en danger des véhicules venant en face). Gérer la priorité des véhicules arrivant en face. Angle mort droit obligatoire (vélos, trottinettes remontent souvent à droite).\nPour le tournant à droite : angle mort droit avant de s'engager. Ne pas serrer trop tôt — les piétons traversent depuis le trottoir.",
          exercice: "Ton accompagnateur surveille de profil : il doit voir ton menton bouger nettement vers ton épaule pour l'angle mort. Si le tournant a été annoncé tôt (clignotant posé il y a 10 secondes), refais l'angle mort juste avant d'agir.",
          habitudes: [
            "Mettre le clignotant en même temps qu'on tourne le volant — trop tard.",
            "Oublier de refaire l'angle mort si le clignotant a été posé trop tôt.",
            "Couper le virage à gauche — trajectoire illégale et dangereuse.",
            "Ne pas regarder les cyclistes à droite avant de tourner à droite.",
          ],
        },
      },
      {
        id: 'C2-5',
        label: "Détecter, identifier et franchir les intersections selon le régime de priorité",
        contenu: {
          inspecteur: "C'est le point éliminatoire le plus fréquent à l'examen. En absence de signalisation, tout véhicule venant de ta droite est prioritaire — dans toutes les rues sans panneau, y compris les plus petites.\n\nComment détecter et identifier une intersection :\n- Chercher la signalisation verticale (panneaux) et horizontale (marquage au sol) dès que possible.\n- En l'absence de signalisation : appliquer la priorité à droite.\n- Méthode d'approche d'une priorité à droite : rétroviseur intérieur → adapter l'allure en passant la 2ème vitesse (pour être prêt à s'arrêter instantanément) → tourner la tête nettement vers la droite pour analyser le débouché.\n- Stop : arrêt COMPLET des roues (3 secondes), même si la route est libre. Puis analyse du trafic avant de repartir.\n- Cédez le passage : ralentir et céder si nécessaire — ne pas s'arrêter systématiquement si le passage est libre.",
          exercice: "À l'approche de chaque intersection sans signalisation : ton accompagnateur voit ta tête tourner nettement à droite. En 2ème vitesse, tu es prêt à t'arrêter à tout moment. Face à un Stop : il chronomètre l'arrêt complet.",
          habitudes: [
            "\"Stop glissé\" : freiner sans vraiment arrêter les roues — faute éliminatoire.",
            "Ne pas regarder à droite car \"il n'y a jamais personne dans cette rue\" — l'inspecteur note le non-contrôle.",
            "Confondre cédez le passage (ralentir) et stop (s'arrêter).",
            "Rouler en 4ème à l'approche d'une priorité à droite — impossible de s'arrêter proprement.",
            "Voir le panneau STOP mais ne pas adapter son allure à l'avance.",
          ],
        },
      },
      {
        id: 'C2-6',
        label: "Franchir les carrefours à sens giratoire et les ronds-points",
        contenu: {
          inspecteur: "Carrefour à sens giratoire : priorité à ceux qui sont engagés sur l'anneau — marquage \"cédez le passage\" à l'entrée.\nRond-point : régime différent — priorité à droite à l'usager qui veut entrer, pas de cédez le passage à l'entrée.\n\nMéthode complète :\nÀ l'entrée : CIA (Contrôler-Informer-Agir), analyse du trafic sur l'anneau, insertion sans forcer mais sans hésitation excessive.\nSur l'anneau : voie intérieure pour sorties à gauche ou demi-tour, voie extérieure pour sorties à droite ou tout droit.\nÀ la sortie : dès que tu passes l'avant-dernière sortie → rétro intérieur + rétro droit + angle mort droit + clignotant droit → sortir proprement.",
          exercice: "Travaillez un giratoire à plusieurs voies : ton accompagnateur vérifie que tu te places à l'entrée dans la bonne voie selon ta sortie, et que l'angle mort droit est fait avant chaque sortie.",
          habitudes: [
            "Mettre le clignotant à gauche et se placer à l'extérieur de l'anneau — source de confusion et dangereux.",
            "Sortir du giratoire sans clignotant droit ni angle mort droit — faute fréquente.",
            "Couper la trajectoire d'une voiture à l'intérieur du giratoire — faute éliminatoire.",
            "Forcer le passage sans attendre que l'anneau soit libre.",
          ],
        },
      },
      {
        id: 'C2-7',
        label: "S'arrêter et stationner en épi, en bataille et en créneau",
        contenu: {
          inspecteur: "La sécurité prime sur la perfection du placement. Elle comprend :\n- Vision directe (regard, pas uniquement rétroviseurs)\n- Allure lente — vitesse d'homme qui marche\n- Clignotant lors de tout déplacement\n- Espaces latéraux vérifiés avant, pendant et après la manœuvre\n- Roues non tournées à l'arrêt (dommages mécaniques)\nUne manœuvre conduite uniquement aux rétroviseurs est éliminatoire. Boîte automatique : gestion de l'allure par le frein uniquement.",
          exercice: "Teste tous les types de stationnement (en avant, en arrière à gauche et à droite). Le regard doit toujours être mobile et chaque mouvement se fait à allure de piéton. Règle des espaces latéraux : jamais moins d'une portière ouverte pendant une manœuvre.",
          habitudes: [
            "Tourner les roues à l'arrêt.",
            "Conduire toute la manœuvre aux rétroviseurs sans vision directe.",
            "Aller trop vite — signe de manque de maîtrise.",
            "Ne pas mettre le clignotant lors des déplacements en manœuvre.",
            "Négliger la vérification des angles morts pendant la manœuvre.",
            "Ne pas s'arrêter lorsqu'on recule et qu'un autre véhicule dépasse — en marche arrière on n'est pas prioritaire.",
          ],
        },
      },
    ],
  },

  // ── COMPÉTENCE 3 ──────────────────────────────────────────────────
  {
    id: 'C3',
    numero: 3,
    titre: 'Conditions difficiles',
    sousTitre: 'Partager la route avec les autres usagers',
    couleur: 'orange',
    emoji: '⚠️',
    poids: 25,
    description: "Ces situations paraissent évidentes parce que tu as déjà conduit. Mais l'examen teste ta maîtrise dans des conditions variées — autoroute, nuit, pluie, trafic dense. Chacune a ses règles propres. Et les autres usagers (piétons, vélos, motos) sont souvent le point faible des conducteurs qui ont longtemps conduit seuls.",
    sousCompetences: [
      {
        id: 'C3-1',
        label: "Évaluer et maintenir les distances de sécurité",
        contenu: {
          inspecteur: "La règle des 2 secondes : repère un point fixe sur la route, attends que le véhicule devant le passe, puis compte deux secondes avant de le franchir à ton tour. Par mauvais temps, double ce délai. Sur voie rapide : les bandes blanches discontinues servent aussi de repère (2 bandes minimum entre toi et le véhicule devant).\nÀ l'arrêt (feu, stop) : immobilise-toi de manière à voir les roues arrière du véhicule devant toucher le sol.\nFace à un deux-roues ou un cycliste : maintiens une distance latérale d'au moins 1 mètre en agglomération, 1,5 mètre hors agglomération.",
          exercice: "Ton accompagnateur te signale immédiatement si tu te rapproches d'un véhicule par inattention. Sur voie rapide, entraîne-toi à compter les secondes à voix haute. À l'arrêt, vérifiez ensemble que tu vois bien les roues arrière du véhicule devant.",
          habitudes: [
            "Coller le véhicule devant par habitude ou pour \"empêcher les autres de s'insérer\".",
            "Ne pas augmenter les distances de sécurité par mauvais temps.",
            "À l'arrêt : s'arrêter trop près des véhicules longs et imposants (camion, bus) — ils doivent pouvoir te voir dans leurs rétroviseurs.",
            "Sous-estimer les distances à haute vitesse — à 110 km/h on parcourt 30 m par seconde.",
          ],
        },
      },
      {
        id: 'C3-2',
        label: "Croiser, dépasser, être dépassé",
        contenu: {
          inspecteur: "Avant tout dépassement, les précautions obligatoires dans l'ordre :\nRétro intérieur → Rétro extérieur gauche → Angle mort gauche → Clignotant gauche → Vérifier que la voie est libre loin devant → Accélération franche → Espace latéral suffisant → Angle mort droit pour se rabattre → Clignotant droit → Se rabattre progressivement.\nDépassement d'un cycliste : autorisé de chevaucher une ligne continue pour dépasser à la bonne distance (1m agglo, 1,5m hors agglo) — mais les 4 roues ne doivent pas franchir la ligne.\nQuand on est dépassé : maintenir sa trajectoire à droite et surtout ne pas accélérer.\nPour croiser : si l'obstacle est de ton côté, tu t'arrêtes avant pour laisser passer l'autre.",
          exercice: "Travaillez le dépassement de cyclistes sur route : ton accompagnateur valide l'espace latéral et le contrôle d'angle mort avant et après le dépassement.",
          habitudes: [
            "Dépasser sans vérifier l'angle mort gauche.",
            "Se rabattre trop tôt, en forçant le véhicule dépassé à freiner.",
            "Accélérer quand on est dépassé — dangereux et agressif.",
            "Franchir une ligne continue avec les 4 roues — faute éliminatoire.",
            "Dépasser quand la visibilité est insuffisante (virage, sommet de côte).",
          ],
        },
      },
      {
        id: 'C3-3',
        label: "Passer des virages et conduire en déclivité",
        contenu: {
          inspecteur: "Virages : tout le freinage et le passage de vitesse sont terminés AVANT de tourner le volant. Le regard cherche la sortie dès l'entrée.\nEn descente : utiliser le frein moteur (rétrograder d'un rapport) pour maintenir l'allure sans garder le pied sur le frein en permanence.\nEn montée : anticiper la perte de puissance, rétrograder plus tôt. Démarrage en côte : avec ou sans frein à main — les deux techniques sont valables. L'essentiel est de ne pas reculer.",
          exercice: "Ton accompagnateur doit ressentir une force centrifuge minimale en virage. En côte : travaille les démarrages jusqu'à ne plus reculer d'un centimètre, que ce soit avec ou sans frein à main.",
          habitudes: [
            "Freiner pendant le virage — déstabilise la voiture.",
            "Descendre une pente en roue libre (point mort) — perte de contrôle et freins surchargés.",
            "Appuyer en permanence sur le frein en descente — surchauffe des freins.",
            "Rater le démarrage en côte et reculer sans contrôle.",
          ],
        },
      },
      {
        id: 'C3-4',
        label: "Connaître les caractéristiques des autres usagers et savoir se comporter à leur égard avec respect et courtoisie",
        contenu: {
          inspecteur: "Les usagers vulnérables et leurs spécificités :\n- Piétons : imprévisibles, notamment les enfants (surgissent entre des voitures), les personnes âgées (traversée lente), les malvoyants (ne voient pas les signaux). Si un piéton montre l'intention de traverser — il regarde la chaussée, il s'avance vers le bord du trottoir — tu t'arrêtes. Risque si ignoré : faute éliminatoire, accident mortel.\n- Cyclistes : trajectoire instable, virages parfois brusques. Distance latérale obligatoire (1m agglo, 1,5m hors). Risque si ignoré : chute du cycliste, accident grave.\n- Deux-roues motorisés : accélération et freinage très différents d'une voiture, inter-files légale. Angle mort difficile à voir.\n- Personnes en fauteuil roulant, poussettes : plus larges, plus lentes, parfois sur la chaussée. Passer loin et doucement.\n- Animaux : réaction imprévisible. Ralentir, ne pas klaxonner.",
          exercice: "À l'approche de chaque passage piéton, balaie les deux trottoirs. Si un piéton s'approche de la bordure, tu relâches l'accélérateur et prépares ton pied sur le frein. Ton accompagnateur te signale chaque usager vulnérable que tu n'as pas détecté assez tôt.",
          habitudes: [
            "Attendre que le piéton mette un pied sur la route pour réagir — trop tard.",
            "Dépasser un cycliste sans laisser l'espace réglementaire \"parce que la route est étroite\".",
            "Klaxonner un cycliste pour qu'il se range — interdit et dangereux.",
            "Manifester verbalement son mécontentement envers un autre usager — mal vu par l'inspecteur, preuve d'immaturité.",
            "Ne pas regarder dans les angles morts avant d'ouvrir sa portière côté route.",
          ],
        },
      },
      {
        id: 'C3-5',
        label: "S'insérer, circuler et sortir d'une voie rapide",
        contenu: {
          inspecteur: "À l'insertion : analyse visuelle de l'affluence du trafic dès l'entrée de la voie d'accélération. Contrôles rétro intérieur + rétro gauche + angle mort gauche pendant l'accélération. Atteindre la vitesse du trafic avant de se décaler — l'insertion se fait parallèlement au trafic, pas en coupant.\nSur la voie rapide : maintien des distances, observation des deux-roues, changements de voie avec CIA complet.\nÀ la sortie : clignotant tôt → contrôle angle mort droit → se décaler dans la voie de décélération → freiner une fois dans la voie de décélération. Ne pas freiner avant d'être dans la voie de décélération.",
          exercice: "Sur la voie d'insertion : accélère franchement. Pendant l'accélération, regarde dans le rétro gauche et l'angle mort pour identifier une place. Refais l'angle mort juste avant de te décaler.\nPour la sortie : anticipe le panneau tôt — clignotant droit, contrôle rétro droit + angle mort droit, décalage dans la voie de décélération AVANT de freiner. Ton accompagnateur vérifie que tu ne freines jamais sur la voie rapide avant d'être dans la voie de décélération.",
          habitudes: [
            "Ne pas accélérer assez franchement par peur — hésitation = danger.",
            "S'insérer à 60 km/h sur une voie où tout le monde roule à 110 km/h.",
            "Oublier l'angle mort gauche avant de s'insérer.",
            "Oublier l'angle mort droit avant de sortir.",
            "Freiner avant d'être dans la voie de décélération — risque de collision arrière.",
          ],
        },
      },
      {
        id: 'C3-6',
        label: "Conduire dans une file de véhicules et dans une circulation dense",
        contenu: {
          inspecteur: "En circulation dense et dans les files : éviter d'accélérer et freiner en permanence, préférer une vitesse stable et constante, laisser la voiture avancer sur son élan quand le trafic ralentit devant. Distances de sécurité augmentées car les réactions sont plus fréquentes.\nObserver les deux-roues qui circulent autour et qui peuvent surgir lors de chaque changement de voie — angle mort systématique.\nNe pas s'arrêter sur un passage piéton même s'il n'y a personne. Ne pas s'engager dans une intersection encombrée si on n'est pas sûr de pouvoir en sortir.",
          exercice: "En heure de pointe, observez ensemble : avant chaque engagement dans une intersection, ton accompagnateur vérifie que tu as la place de sortir. En bouchon, il surveille que tu ne te retrouves jamais à cheval sur un passage piéton.",
          habitudes: [
            "Accélérer-freiner en permanence dans les bouchons (inconfort, consommation, usure).",
            "S'engager dans un carrefour sans être sûr de pouvoir en sortir.",
            "S'arrêter sur un passage piéton par inattention.",
            "Oublier les deux-roues qui remontent les files lors d'un changement de voie.",
          ],
        },
      },
      {
        id: 'C3-7',
        label: "Conduire quand l'adhérence et la visibilité sont réduites",
        contenu: {
          inspecteur: "Une réaction immédiate et sans qu'on te le dise, adaptée à chaque condition :\n- Pluie : essuie-glaces + feux de croisement + baisse de vitesse + distances augmentées.\n- Brouillard : feux de brouillard + vitesse encore réduite + distances très augmentées.\n- Nuit : passage feux de route / feux de croisement sans éblouir les autres, adaptation de la vitesse à la visibilité disponible.\n- Verglas ou neige : vitesse très réduite, distances multipliées, pas de freinage brusque.\n- Par temps chaud et ensoleillé : ventilation et climatisation sont des réflexes de sécurité — la chaleur génère de la fatigue et de la somnolence. Sur voie rapide : attention à l'effet hypnotique lié à la monotonie.",
          exercice: "S'il se met à pleuvoir pendant la session, ton accompagnateur reste silencieux et observe. Tu dois avoir le réflexe instantané sans qu'on te le demande : baisser la vitesse, allumer les feux de croisement, enclencher les essuie-glaces. Faites aussi des sessions de nuit pour travailler le passage feux de route / feux de croisement.",
          habitudes: [
            "Continuer à rouler à la même vitesse sous la pluie ou par brouillard.",
            "Allumer uniquement les feux de position par mauvais temps — insuffisant et interdit.",
            "Pomper les freins sur route glissante (annule l'ABS).",
            "Négliger la ventilation par beau temps et conduire dans une voiture surchauffée.",
            "Mettre les feux de brouillard par temps clair — interdit et aveuglant pour les autres.",
          ],
        },
      },
    ],
  },

  // ── COMPÉTENCE 4 ──────────────────────────────────────────────────
  {
    id: 'C4',
    numero: 4,
    titre: 'Conduite autonome, sûre et écocitoyenne',
    sousTitre: 'Économique et écologique',
    couleur: 'green',
    emoji: '🌿',
    poids: 10,
    description: "La conduite autonome, c'est conduire comme si l'inspecteur n'était pas là. L'examen teste si tu sais prendre des décisions seul·e — choisir ta voie, gérer une erreur d'itinéraire, préparer un trajet. C'est souvent là que les candidats libres se démarquent positivement, car ils ont l'expérience de la route.",
    sousCompetences: [
      {
        id: 'C4-1',
        label: "Suivre un itinéraire de manière autonome",
        contenu: {
          inspecteur: "C'est la phase de conduite autonome — elle dure environ 5 à 10 minutes. L'inspecteur donne une direction au départ (\"Suivez la direction Centre-Ville\") puis ne dit plus rien. Il observe ta capacité à lire les panneaux, choisir les bonnes voies et prendre des décisions seul, tout en maintenant une conduite sécurisée. Se tromper de route n'est pas éliminatoire tant que tu le fais en sécurité. Il est même bien vu de verbaliser son erreur — \"Je me suis trompé, je vais rectifier au prochain carrefour\".",
          exercice: "Il te donne une consigne au départ puis reste silencieux pendant 5 à 10 minutes. Tu gères seul(e) : contrôles systématiques, adaptation de l'allure, prise de décision aux intersections, lecture des panneaux, placement dans les bonnes voies. Si tu te trompes, verbalise-le et gère la correction en sécurité — pas de coup de volant brusque, pas de manœuvre précipitée.",
          habitudes: [
            "Regarder le GPS au lieu des panneaux (distraction + perte du regard route).",
            "Changer de voie ou faire demi-tour brusquement après s'être trompé.",
            "Paniquer quand on se perd et perdre les automatismes de sécurité.",
            "Demander de l'aide à l'accompagnateur alors que la phase d'autonomie a commencé.",
          ],
        },
      },
      {
        id: 'C4-2',
        label: "Préparer et effectuer un voyage longue distance",
        contenu: {
          inspecteur: "Ces connaissances font partie des questions de vérifications. Elles doivent être acquises avant l'examen — il n'y a pas de mise en pratique de ce thème le jour J.\nLa préparation d'un trajet comprend : vérification du véhicule (niveaux, pression des pneus, éclairage), consultation des conditions météo et de trafic, choix de l'heure de départ, planification des pauses. Pour le chargement : les bagages doivent être arrimés, rien ne doit obstruer la vision arrière, les vélos portés à l'arrière ne doivent pas masquer la plaque ni les feux — un dispositif d'éclairage déporté est obligatoire dans ce cas.",
          exercice: "Organisez ensemble une sortie de 1h30 minimum sur routes variées. Avant de partir : check-list véhicule complète. Pendant le trajet : identifiez ensemble les moments de baisse de concentration. La capacité d'attention diminue significativement après 2 heures de conduite continue — les pauses ne sont pas optionnelles.",
          habitudes: [
            "Partir sans vérifier les pneus, les niveaux ou l'éclairage.",
            "Transporter des objets non arrimés dans l'habitacle (projectiles en cas de freinage d'urgence).",
            "Dépasser les 2 heures de conduite sans pause en croyant \"tenir\" encore.",
            "Mettre des vélos sans dispositif d'éclairage déporté — contravention et danger.",
          ],
        },
      },
      {
        id: 'C4-3',
        label: "Connaître les principaux facteurs de risque au volant et les recommandations à appliquer",
        contenu: {
          inspecteur: "Ces connaissances font partie des questions de vérifications. Elles doivent être acquises avant l'examen — il n'y a pas de mise en pratique de ce thème le jour J.\nL'alcool, les drogues et certains médicaments altèrent la vision, le temps de réaction, la prise de décision et la coordination — sans que le conducteur en ait conscience. La fatigue produit les mêmes effets. Le téléphone multiplie par 3 le risque d'accident. La distraction visuelle (regarder hors de la route 2 secondes à 90 km/h = 50 mètres parcourus sans regarder) est l'une des premières causes d'accidents. La chaleur excessive dans l'habitacle accélère la somnolence — utiliser la ventilation et la climatisation est un réflexe de sécurité.",
          exercice: "Apprends à détecter tes propres signaux d'alerte : bâillements répétés, fixité du regard, erreurs sur les clignotants, difficultés à maintenir la trajectoire. Ce sont des signaux physiologiques réels — s'arrêter dès qu'ils apparaissent. Ton accompagnateur doit s'interdire de te montrer son téléphone ou de régler le GPS pendant que tu roules.",
          habitudes: [
            "Croire qu'on \"tient\" l'alcool mieux que les autres.",
            "Consulter son téléphone \"juste une seconde\" en conduisant.",
            "Rouler avec un habitacle surchauffé par beau temps sans ventiler.",
            "Ignorer les bâillements et la somnolence en pensant \"encore un peu et j'arrive\".",
            "Prendre le volant après des médicaments sans lire la notice (pictogramme voiture).",
          ],
        },
      },
      {
        id: 'C4-4',
        label: "Adopter les bons comportements en cas d'accident",
        contenu: {
          inspecteur: "Ces connaissances font partie des questions de vérifications. Elles doivent être acquises avant l'examen — il n'y a pas de mise en pratique de ce thème le jour J.\nLa règle fondamentale : P.A.S. — Protéger, Alerter, Secourir, dans cet ordre impératif.\n\nProtéger : couper le moteur, allumer les feux de détresse, mettre le gilet jaune AVANT de sortir du véhicule, poser le triangle à au moins 30 mètres en amont (150 mètres sur autoroute). Ne jamais traverser une voie rapide sans avoir sécurisé la zone.\n\nAlerter : appeler le 15 (SAMU), le 17 (Police), le 18 (Pompiers) ou le 112 (numéro européen). Transmettre : lieu précis, nature de l'accident, nombre de victimes, état apparent des blessés.\n\nSecourir : uniquement si on est formé. Victime inconsciente qui respire → PLS. Victime inconsciente qui ne respire pas → massage cardiaque. Ne pas déplacer une victime sauf danger immédiat. Ne jamais retirer le casque d'un motocycliste blessé.",
          exercice: "Simulez verbalement un accident pendant une séance : qui appelle-t-on, que dit-on, dans quel ordre. Ton accompagnateur peut te tester à l'improviste : \"Gilet et triangle !\" — tu dois lui dire instantanément où ils se trouvent dans le véhicule. Entraîne-toi à réciter les étapes P.A.S. sans hésiter.",
          habitudes: [
            "Sortir du véhicule sur voie rapide sans gilet et sans triangle posé.",
            "Se précipiter vers les victimes sans avoir sécurisé la zone.",
            "Tenter de déplacer une victime par panique.",
            "Retirer le casque d'un motocycliste blessé.",
            "Appeler sans savoir donner la localisation précise.",
            "Pratiquer des gestes de secourisme sans formation adéquate.",
          ],
        },
      },
      {
        id: 'C4-5',
        label: "Faire l'expérience des aides à la conduite embarquées",
        contenu: {
          inspecteur: "Il est autorisé d'utiliser le régulateur ou le limiteur de vitesse pendant l'examen, notamment sur voies rapides. Les principaux systèmes à connaître :\n- Régulateur de vitesse : maintient automatiquement la vitesse choisie.\n- Limiteur de vitesse : empêche de dépasser la vitesse programmée.\n- Régulateur adaptatif (ACC) : maintient la vitesse ET la distance avec le véhicule devant.\n- ABS : empêche les roues de se bloquer au freinage d'urgence — maintenir une pression forte et constante sur la pédale, ne pas pomper.\n- ESP : corrige automatiquement les pertes d'adhérence.\n- Aide au maintien de voie, caméra de recul, radars de stationnement.\n\nRègle absolue : tu restes le maître à bord. Ces systèmes assistent, ils ne conduisent pas.",
          exercice: "Prenez 15 minutes à l'arrêt pour identifier et tester chaque système du véhicule que tu utiliseras le jour J. Règle d'or pendant les manœuvres : aucun regard sur l'écran de recul de plus d'une seconde — les yeux tournent à 360° en permanence.",
          habitudes: [
            "Faire confiance aveuglément à l'aide au maintien de voie et ne plus contrôler la trajectoire.",
            "Pomper la pédale de frein en cas de freinage d'urgence (annule l'effet ABS).",
            "Conduire une manœuvre entière en regardant uniquement l'écran de recul.",
            "Ne découvrir les systèmes du véhicule que le jour de l'examen.",
          ],
        },
      },
      {
        id: 'C4-6',
        label: "Avoir des notions sur l'entretien, le dépannage et les situations d'urgence",
        contenu: {
          inspecteur: "La règle P.A.S. en cas d'accident : Protéger → Alerter → Secourir.\nProtéger : couper le moteur, allumer les feux de détresse, mettre le gilet jaune AVANT de sortir du véhicule, poser le triangle à au moins 30 mètres (150 m sur autoroute). Ne jamais traverser une voie rapide pour aller vers les blessés sans avoir sécurisé.\nAlerter : appeler le 15 (SAMU), le 17 (Police), le 18 (Pompiers) ou le 112. Donner : lieu précis, nature de l'accident, nombre de victimes, état apparent des blessés.\nSecourir : uniquement si formé. PLS pour victime inconsciente qui respire. Massage cardiaque si elle ne respire pas. Compression directe sur une hémorragie. Ne pas déplacer une victime sauf danger immédiat. Ne jamais retirer le casque d'un motocycliste blessé.",
          exercice: "\"Gilet et triangle !\" — ton accompagnateur te teste n'importe quand : tu dois dire instantanément où ils se trouvent dans le véhicule. Simulez verbalement un accident : qui appelle-t-on, que dit-on, dans quel ordre.",
          habitudes: [
            "Sortir du véhicule sur voie rapide sans gilet et sans triangle posé.",
            "Tenter de déplacer une victime par panique.",
            "Appeler le 15/18 sans savoir donner la localisation précise.",
            "Retirer le casque d'un motocycliste blessé.",
            "Rester dans son véhicule en panne ou se placer devant lui.",
            "Ne pas se mettre correctement derrière les glissières de sécurité lors d'une panne sur autoroute.",
          ],
        },
      },
      {
        id: 'C4-7',
        label: "Pratiquer l'écoconduite",
        contenu: {
          inspecteur: "Une conduite fluide, anticipée et économe — c'est aussi un point bonus à l'examen. Les principes :\n- Anticiper les décélérations : relâcher l'accélérateur loin à l'avance (feu rouge à 150m = on lève le pied immédiatement).\n- Monter les vitesses tôt : passer en rapport supérieur à ~2000 tr/min (essence) ou ~1500 tr/min (diesel).\n- Éviter les accélérations inutiles suivies de freinages — stabiliser sa vitesse.\n- Pneus gonflés à la bonne pression : économie de 0,5L/100km.\n- Climatisation utilisée avec modération : consommation +1L/100km.",
          exercice: "À l'approche d'un feu rouge ou d'un ralentissement : relâche l'accélérateur dès que tu le vois, laisse la voiture avancer sur son élan (frein moteur), n'use les freins qu'en dernier recours. Pendant la séance, ton accompagnateur doit noter si ta conduite est fluide et sans à-coups constants — c'est le meilleur indicateur d'écoconduite.",
          habitudes: [
            "Accélérer fort puis freiner fort — double peine (consommation + usure).",
            "Rester en sous-régime moteur \"pour économiser\" — contre-productif.",
            "Monter trop vite en vitesse sans assez d'accélérateur (le moteur peine).",
            "Oublier de vérifier la pression des pneus et leur état.",
            "Laisser tourner le moteur à l'arrêt prolongé.",
          ],
        },
      },
    ],
  },
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
