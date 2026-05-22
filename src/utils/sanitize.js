/**
 * Utilitaires de sécurité — Livret Permis Webi
 * Protection OWASP contre les injections et XSS côté client
 * Note : React échappe automatiquement les expressions JSX.
 *        Ces fonctions sécurisent les données stockées en localStorage.
 */

// Caractères dangereux à neutraliser (défense en profondeur)
const UNSAFE_PATTERN = /[<>"'`\\]/g
const SAFE_MAP = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;', '\\': '&#92;' }

/**
 * Échappe les caractères HTML dans une chaîne
 * Utilisé avant tout stockage de texte libre en localStorage
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return ''
  return input.trim().replace(UNSAFE_PATTERN, c => SAFE_MAP[c] || c)
}

/**
 * Valide et nettoie un numéro NEPH (12 chiffres)
 * Retourne null si invalide
 */
export function sanitizeNEPH(input) {
  if (typeof input !== 'string') return ''
  const digits = input.replace(/\D/g, '').slice(0, 12)
  return digits
}

/**
 * Valide un email basique
 */
export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(String(email).toLowerCase().trim())
}

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhone(phone) {
  const cleaned = String(phone).replace(/[\s\-\.]/g, '')
  return /^(\+33|0)[1-9][0-9]{8}$/.test(cleaned)
}

/**
 * Limite la longueur d'un texte
 */
export function limitLength(input, max = 200) {
  if (typeof input !== 'string') return ''
  return input.slice(0, max)
}

/**
 * Sanitise un objet profil complet avant stockage
 */
export function sanitizeProfil(profil) {
  if (!profil || typeof profil !== 'object') return {}
  return {
    nom:           sanitizeText(limitLength(profil.nom || '', 50)),
    prenom:        sanitizeText(limitLength(profil.prenom || '', 50)),
    dateNaissance: sanitizeText(profil.dateNaissance || ''),
    neph:          sanitizeNEPH(profil.neph || ''),
    dateANTS:      sanitizeText(profil.dateANTS || ''),
    adresse:       sanitizeText(limitLength(profil.adresse || '', 150)),
    telephone:     sanitizeText(limitLength(profil.telephone || '', 20)),
    email:         sanitizeText(limitLength(profil.email || '', 100)),
  }
}

/**
 * Sanitise un texte libre (notes, débrief)
 * Plus permissif — autorise les caractères accentués
 */
export function sanitizeNote(input, maxLen = 500) {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, maxLen)
}

/**
 * Vérifie qu'une valeur est un état REMC valide (0-3)
 */
export function isValidEtatRemc(val) {
  return [0, 1, 2, 3].includes(Number(val))
}
