// Onglet 4 — Profil candidat (V1.5 — guide installation PWA intelligent)
import { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ModePresentation from './ModePresentation'

/**
 * Compresse une image via un canvas avant stockage en localStorage.
 * Une photo 50 MP (40-50 Mo) devient ~200-500 Ko — transparent pour l'utilisateur.
 * Les PDF ne passent pas ici (non pris en charge par canvas).
 * @param {File} file  - fichier image
 * @param {number} maxWidth  - largeur max en px (défaut 1600)
 * @param {number} quality   - qualité JPEG 0-1 (défaut 0.82)
 */
function compressImage(file, maxWidth = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width)
          width = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Détecte la plateforme et l'état d'installation de la PWA.
 * Renvoie un guide d'installation adapté :
 *  - Si déjà en mode standalone (installée) → rien
 *  - iOS Safari → instructions Partager → Ajouter
 *  - Android Chrome → bouton natif si dispo + instructions manuelles
 *  - Autre → instructions génériques
 */
function BandeauInstall() {
  const [installe, setInstalle] = useLocalStorage('pw_pwa_installed', false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [etape, setEtape] = useState(null) // null | 'guide'

  // Détections
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true
  const ua = navigator.userAgent
  const isIOS     = /iphone|ipad|ipod/i.test(ua)
  const isAndroid = /android/i.test(ua)
  const isSamsung = /samsungbrowser/i.test(ua)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Déjà installée en standalone ou utilisateur a confirmé → ne rien afficher
  if (isStandalone || installe) return null

  const handleInstallNatif = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstalle(true)
  }

  // ── iOS ──────────────────────────────────────────────────────
  if (isIOS) {
    return (
      <div className="mb-4 rounded-2xl p-4"
           style={{ background: 'rgba(181,134,60,0.07)', border: '1px solid rgba(181,134,60,0.25)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-extrabold text-pw-ink">📲 Ajouter à l'écran d'accueil</p>
          <button onClick={() => setInstalle(true)}
                  className="text-[10px] text-pw-ink-soft/35 hover:text-pw-ink">✕ Masquer</button>
        </div>
        <p className="text-[11px] text-pw-ink leading-relaxed mb-3">
          Sur iPhone/iPad, Apple ne permet pas l'installation automatique. Voici comment faire en 3 secondes :
        </p>
        <div className="space-y-2">
          {[
            { n: '1', texte: 'Appuie sur le bouton Partager', sub: '📤 en bas de Safari (pas dans Chrome !)' },
            { n: '2', texte: 'Fais défiler et appuie sur', sub: '"Sur l\'écran d\'accueil"' },
            { n: '3', texte: 'Appuie sur "Ajouter" en haut à droite', sub: 'L\'icône apparaît sur ton bureau' },
          ].map(({ n, texte, sub }) => (
            <div key={n} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-extrabold mt-0.5"
                   style={{ background: '#B5863C', color: '#f8f2e5' }}>{n}</div>
              <div>
                <p className="text-xs font-semibold text-pw-ink">{texte}</p>
                <p className="text-[10px] text-pw-ink">{sub}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-pw-ink-soft/35 mt-3">⚠️ Doit être fait depuis Safari — pas Chrome iOS</p>
        <button onClick={() => setInstalle(true)}
                className="w-full mt-3 py-2 rounded-full text-xs font-bold tap-scale"
                style={{ background: 'rgba(181,134,60,0.15)', border: '1px solid rgba(181,134,60,0.35)', color: '#B5863C' }}>
          ✓ C'est fait — j'ai ajouté l'icône
        </button>
      </div>
    )
  }

  // ── Android ──────────────────────────────────────────────────
  if (isAndroid) {
    return (
      <div className="mb-4 rounded-2xl p-4"
           style={{ background: 'rgba(181,134,60,0.07)', border: '1px solid rgba(181,134,60,0.25)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-extrabold text-pw-ink">📲 Ajouter à l'écran d'accueil</p>
          <button onClick={() => setInstalle(true)}
                  className="text-[10px] text-pw-ink-soft/35 hover:text-pw-ink">✕ Masquer</button>
        </div>

        {/* Bouton natif Chrome si disponible */}
        {installPrompt && (
          <button onClick={handleInstallNatif}
                  className="w-full mb-3 py-2.5 rounded-xl text-sm font-extrabold tap-scale"
                  style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
            ⚡ Installer en un clic
          </button>
        )}

        {/* Instructions manuelles toujours visibles */}
        <p className="text-[11px] text-pw-ink leading-relaxed mb-2">
          {installPrompt
            ? 'Ou manuellement :'
            : 'Le bouton automatique n\'est plus disponible. Voici comment faire :'}
        </p>
        <div className="space-y-2 mb-3">
          {[
            { n: '1', texte: 'Ouvre Chrome (pas Samsung Internet)', sub: 'L\'URL doit afficher livret-dapprentissage-candidat-libre.permiswebi.fr' },
            { n: '2', texte: 'Appuie sur ⋮ (3 points) en haut à droite', sub: isSamsung ? 'Avec Samsung Internet : Menu → Ajouter la page' : '' },
            { n: '3', texte: 'Sélectionne "Ajouter à l\'écran d\'accueil"', sub: '' },
            { n: '4', texte: isSamsung ? 'L\'icône va dans le tiroir d\'applis Samsung' : 'L\'icône s\'ajoute sur ton écran d\'accueil', sub: isSamsung ? 'Long-appui sur l\'icône → "Ajouter à l\'accueil" pour la mettre sur le bureau' : '' },
          ].map(({ n, texte, sub }) => (
            <div key={n} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-extrabold mt-0.5"
                   style={{ background: '#B5863C', color: '#f8f2e5' }}>{n}</div>
              <div>
                <p className="text-xs font-semibold text-pw-ink">{texte}</p>
                {sub && <p className="text-[10px] text-pw-ink leading-snug mt-0.5">{sub}</p>}
              </div>
            </div>
          ))}
        </div>
        {isSamsung && (
          <div className="px-3 py-2 rounded-xl mb-3"
               style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)' }}>
            <p className="text-[10px] text-pw-ink leading-relaxed">
              ⚠️ <strong className="text-pw-ink">Samsung Galaxy :</strong> Chrome ajoute l'icône dans le tiroir d'applis, pas directement sur le bureau. Pour la mettre sur l'écran d'accueil, appuie long sur l'icône dans le tiroir → "Ajouter à l'accueil".
            </p>
          </div>
        )}
        <button onClick={() => setInstalle(true)}
                className="w-full py-2 rounded-full text-xs font-bold tap-scale"
                style={{ background: 'rgba(181,134,60,0.15)', border: '1px solid rgba(181,134,60,0.35)', color: '#B5863C' }}>
          ✓ C'est fait — j'ai ajouté l'icône
        </button>
      </div>
    )
  }

  // ── Autre navigateur ──────────────────────────────────────────
  return (
    <div className="mb-4 px-3 py-2.5 rounded-xl text-xs text-pw-ink text-center"
         style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.08)' }}>
      📱 Pour installer l'app : Menu de ton navigateur → "Ajouter à l'écran d'accueil"
      <button onClick={() => setInstalle(true)} className="block mx-auto mt-1 text-[10px] text-pw-ink-soft/30">✕ Masquer</button>
    </div>
  )
}

const CHAMPS = [
  { id: 'nom',           label: 'Nom',                     type: 'text',  placeholder: 'Dupont' },
  { id: 'prenom',        label: 'Prénom',                   type: 'text',  placeholder: 'Karim' },
  { id: 'dateNaissance', label: 'Date de naissance',        type: 'date',  placeholder: '' },
  { id: 'neph',          label: 'Numéro NEPH',             type: 'text',  placeholder: '123456789012', maxLength: 12, inputMode: 'numeric', pattern: '[0-9]*' },
  { id: 'dateANTS',      label: 'Dossier ANTS validé le',  type: 'date',  placeholder: '', optionnel: true },
  { id: 'adresse',       label: 'Adresse complète',         type: 'text',  placeholder: '12 rue de la Paix, 75001 Paris' },
  { id: 'telephone',     label: 'Téléphone',                type: 'tel',   placeholder: '06 12 34 56 78' },
  { id: 'email',         label: 'Email',                    type: 'email', placeholder: 'karim.dupont@email.fr' },
]

/**
 * Composant d'upload d'un document (photo ou PDF)
 * Stocké en base64 dans localStorage
 */
function DocUpload({ label, icone = '📎', valeur, onChange }) {
  const refFile = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Images : compression automatique (50 MP → ~400 Ko, invisible pour l'utilisateur)
    if (file.type.startsWith('image/')) {
      const compressed = await compressImage(file, 1600, 0.82)
      onChange(compressed)
      return
    }
    // PDF : limite à 5 Mo (les PDF sont déjà compressés)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ce fichier PDF est trop lourd (max 5 Mo). Essaie de le compresser avant de l\'importer.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  const isImage = valeur?.startsWith('data:image')

  return (
    <div className="mb-3">
      {valeur ? (
        <div className="rounded-xl p-3 flex items-center gap-3"
             style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.4)' }}>
          {isImage ? (
            <img src={valeur} alt={label}
                 className="h-14 w-14 min-w-[56px] rounded-lg object-cover"
                 style={{ border: '1px solid rgba(33,28,22,0.15)' }} />
          ) : (
            <div className="h-14 w-14 min-w-[56px] rounded-lg flex items-center justify-center text-2xl"
                 style={{ background: 'rgba(33,28,22,0.08)' }}>
              📄
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-0.5">
              {label}
            </p>
            <p className="text-xs font-semibold" style={{ color: '#33cc66' }}>✓ Document ajouté</p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => refFile.current.click()}
              className="text-[10px] px-2 py-1 rounded-full font-bold"
              style={{ background: 'rgba(181,134,60,0.15)', color: '#B5863C', border: '1px solid rgba(181,134,60,0.35)' }}
            >
              ↺ Changer
            </button>
            <button
              onClick={() => onChange(null)}
              className="text-[10px] px-2 py-1 rounded-full font-bold"
              style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
            >
              × Retirer
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => refFile.current.click()}
          className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all tap-scale"
          style={{
            background: 'rgba(33,28,22,0.04)',
            border: '2px dashed rgba(33,28,22,0.16)',
            color: '#211C16',
          }}
        >
          <span className="text-lg">{icone}</span>
          <span>{label}</span>
        </button>
      )}
      <input
        ref={refFile}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

/**
 * Accordéon réutilisable — style dark app, chevron animé, un seul ouvert à la fois
 * ScrollIntoView automatique à l'ouverture (titre visible en haut)
 */
function Accordeon({ titre, ouvert, onToggle, children }) {
  const ref = useRef()
  useEffect(() => {
    if (!ouvert || !ref.current) return
    const timer = setTimeout(() => {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(timer)
  }, [ouvert])

  return (
    <div ref={ref} className="rounded-xl overflow-hidden mb-2"
         style={{ background: 'rgba(33,28,22,0.04)', border: `1px solid ${ouvert ? 'rgba(181,134,60,0.30)' : 'rgba(33,28,22,0.08)'}`, transition: 'border-color 0.2s' }}>
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left tap-scale"
        onClick={onToggle}
      >
        <span className="text-xs font-extrabold text-pw-ink leading-snug flex-1">{titre}</span>
        <span className="text-[10px] shrink-0 transition-transform duration-250"
              style={{ color: ouvert ? '#B5863C' : 'rgba(33,28,22,0.35)', transform: ouvert ? 'rotate(180deg)' : 'none' }}>
          ▼
        </span>
      </button>
      {ouvert && (
        <div className="px-4 pb-4 pt-1 border-t border-pw-line/[0.06] space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Profil({ ouvrirPresentation }) {
  const [profil, setProfil] = useLocalStorage('pw_profil', {})
  const [photo, setPhoto] = useLocalStorage('pw_photo', null)
  const [etats] = useLocalStorage('pw_competences', {})
  const [seances] = useLocalStorage('pw_seances', [])

  // Documents obligatoires
  const [docAipc, setDocAipc]               = useLocalStorage('pw_doc_aipc', null)
  const [docCharte, setDocCharte]            = useLocalStorage('pw_doc_charte', null)
  const [docAttestation, setDocAttestation] = useLocalStorage('pw_doc_attestation', null)
  const [docPermisRecto, setDocPermisRecto] = useLocalStorage('pw_doc_permis_recto', null)
  const [docPermisVerso, setDocPermisVerso] = useLocalStorage('pw_doc_permis_verso', null)

  const [modeEdition, setModeEdition] = useState(!profil.nom)
  const [draft, setDraft] = useState(profil)
  const [showPresentation, setShowPresentation] = useState(!!ouvrirPresentation)
  const [accordeonOuvert, setAccordeonOuvert] = useState(null)
  const [alerteVue, setAlerteVue] = useLocalStorage('pw_preambule_alerte_vue', null)
  const fileRef = useRef()

  useEffect(() => {
    if (ouvrirPresentation) setShowPresentation(true)
  }, [ouvrirPresentation])

  const handlePhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Compression forte pour la photo de profil (affichée en petit)
    const compressed = await compressImage(file, 800, 0.85)
    setPhoto(compressed)
  }

  const handleSave = () => { setProfil(draft); setModeEdition(false) }

  const docs = {
    aipc: docAipc,
    charte: docCharte,
    attestation: docAttestation,
    permisRecto: docPermisRecto,
    permisVerso: docPermisVerso,
  }

  const nbDocs = Object.values(docs).filter(Boolean).length

  // Mode présentation plein écran fond blanc
  if (showPresentation) {
    return (
      <ModePresentation
        profil={profil} photo={photo} etats={etats} seances={seances}
        docs={docs}
        onQuitter={() => setShowPresentation(false)}
      />
    )
  }

  const profilComplet = profil.nom && profil.prenom && profil.neph

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="text-center mb-5">
        <h1 className="text-xl font-extrabold text-pw-ink">Mon profil</h1>
        <p className="text-xs text-pw-ink mt-1">Remplis tes infos une seule fois — elles restent sur ton téléphone</p>
      </div>

      {/* Bouton mode présentation */}
      <button onClick={() => setShowPresentation(true)}
              className="w-full mb-3 py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: 'rgba(181,134,60,0.12)', border: '1px solid rgba(181,134,60,0.4)', color: '#B5863C' }}>
        🪪 Mode présentation — Contrôle / Examen
      </button>

      {/* Guide installation PWA — détecte automatiquement iOS / Android / Samsung */}
      <BandeauInstall />

      {/* Carte profil */}
      {!modeEdition && profilComplet && (
        <div className="rounded-2xl overflow-hidden mb-4"
             style={{ background: '#FFFDF9', border: '1px solid rgba(181,134,60,0.35)' }}>
          <div className="px-4 pt-4 pb-3 flex items-center justify-between"
               style={{ borderBottom: '1px solid rgba(181,134,60,0.2)' }}>
            <div className="flex items-center gap-2">
              <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
                   alt="Permis Webi" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: '#B5863C' }}>Permis Webi</p>
                <p className="text-[9px] text-pw-ink uppercase tracking-wide">Livret d'apprentissage</p>
              </div>
            </div>
            <div className="text-[9px] font-bold px-2 py-1 rounded-full"
                 style={{ background: 'rgba(181,134,60,0.15)', color: '#B5863C', border: '1px solid rgba(181,134,60,0.35)' }}>
              Candidat libre
            </div>
          </div>
          <div className="px-4 py-4 flex gap-4">
            <div className="w-20 h-24 min-w-[80px] rounded-xl overflow-hidden flex items-center justify-center"
                 style={{ background: 'rgba(33,28,22,0.08)', border: '1px solid rgba(33,28,22,0.15)' }}>
              {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <span className="text-3xl">👤</span>}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-lg font-extrabold text-pw-ink leading-tight truncate">
                {profil.prenom} {profil.nom?.toUpperCase()}
              </p>
              {profil.dateNaissance && (
                <p className="text-xs text-pw-ink">
                  Né·e le {new Date(profil.dateNaissance).toLocaleDateString('fr-FR')}
                </p>
              )}
              {profil.neph && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                     style={{ background: 'rgba(181,134,60,0.15)', color: '#B5863C', border: '1px solid rgba(181,134,60,0.35)' }}>
                  NEPH {profil.neph}
                </div>
              )}
              {profil.adresse && <p className="text-xs text-pw-ink truncate">{profil.adresse}</p>}
            </div>
          </div>
          <div className="px-4 py-2 text-[9px] text-pw-ink-soft/30"
               style={{ borderTop: '1px solid rgba(33,28,22,0.07)' }}>
            Conforme REMC — Arrêté du 29 juillet 2013
          </div>
        </div>
      )}

      {/* Formulaire */}
      {(modeEdition || !profilComplet) && (
        <div className="rounded-2xl p-4 mb-4"
             style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>
          {/* Photo */}
          <div className="flex flex-col items-center mb-5">
            <div onClick={() => fileRef.current.click()}
                 className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer mb-2 transition-all hover:opacity-80"
                 style={{ border: '2px dashed rgba(181,134,60,0.5)', background: 'rgba(181,134,60,0.08)' }}>
              {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <span className="text-3xl">📸</span>}
            </div>
            <button onClick={() => fileRef.current.click()} className="text-xs font-semibold" style={{ color: '#B5863C' }}>
              {photo ? 'Changer la photo' : 'Ajouter ma photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhoto} />
          </div>

          {CHAMPS.map(c => (
            <div key={c.id} className="mb-3">
              <label className="text-xs font-bold uppercase tracking-wide text-pw-ink mb-1 block">
                {c.label}
                {c.id === 'neph' && <span className="text-pw-ink-soft/40 normal-case font-normal ml-1">(12 chiffres)</span>}
                {c.optionnel && <span className="text-pw-ink-soft/30 normal-case font-normal ml-1">(optionnel)</span>}
              </label>
              <input type={c.type} value={draft[c.id] || ''}
                     onChange={e => setDraft(d => ({ ...d, [c.id]: e.target.value }))}
                     placeholder={c.placeholder} maxLength={c.maxLength}
                     inputMode={c.inputMode} pattern={c.pattern}
                     className="w-full px-3 py-2.5 rounded-xl text-sm text-pw-ink placeholder-pw-ink-soft/25 outline-none transition-all"
                     style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)', colorScheme: c.type === 'date' ? 'dark' : undefined }}
                     onFocus={e => e.target.style.borderColor = 'rgba(181,134,60,0.6)'}
                     onBlur={e => e.target.style.borderColor = 'rgba(33,28,22,0.12)'} />
              {c.id === 'neph' && draft.neph && draft.neph.length !== 12 && (
                <p className="text-xs text-orange-400 mt-0.5">Le NEPH doit contenir exactement 12 chiffres</p>
              )}
            </div>
          ))}

          <button onClick={handleSave}
                  className="w-full py-3 rounded-full font-extrabold text-sm mt-2 transition-all active:scale-95"
                  style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
            ✅ Enregistrer mon profil
          </button>
        </div>
      )}

      {/* Modifier profil */}
      {!modeEdition && profilComplet && (
        <button onClick={() => { setDraft(profil); setModeEdition(true) }}
                className="w-full mb-5 py-2.5 rounded-full text-xs font-bold transition-all"
                style={{ background: 'rgba(33,28,22,0.06)', border: '1px solid rgba(33,28,22,0.12)', color: '#211C16' }}>
          ✏️ Modifier mon profil
        </button>
      )}

      {/* ── DOCUMENTS OBLIGATOIRES ─────────────────────────────── */}
      <div className="rounded-2xl p-4 mb-4"
           style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: '#B5863C' }}>
            📂 Documents obligatoires
          </p>
          {nbDocs > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(29,158,117,0.2)', color: '#33cc66', border: '1px solid rgba(29,158,117,0.4)' }}>
              {nbDocs}/5 ajouté{nbDocs > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-[10px] text-pw-ink mb-4 leading-relaxed">
          À présenter aux forces de l'ordre en cas de contrôle et le jour de l'examen.
          Visibles dans le Mode Présentation.
        </p>

        {/* Document candidat */}
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-2">
          📋 Document du candidat
        </p>
        <DocUpload
          label="AIPC ou récépissé de dépôt de dossier"
          icone="🪪"
          valeur={docAipc}
          onChange={setDocAipc}
        />

        {/* Documents accompagnateur */}
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-pw-ink mb-2 mt-4">
          👥 Documents de l'accompagnateur
        </p>
        <DocUpload
          label="Charte de l'accompagnateur"
          icone="📝"
          valeur={docCharte}
          onChange={setDocCharte}
        />
        <DocUpload
          label="Attestation sur l'honneur (lien personnel/parenté)"
          icone="📜"
          valeur={docAttestation}
          onChange={setDocAttestation}
        />
        <DocUpload
          label="Photo recto du permis de l'accompagnateur"
          icone="🪪"
          valeur={docPermisRecto}
          onChange={setDocPermisRecto}
        />
        <DocUpload
          label="Photo verso du permis de l'accompagnateur"
          icone="🔄"
          valeur={docPermisVerso}
          onChange={setDocPermisVerso}
        />

        {nbDocs < 5 && (
          <div className="mt-3 px-3 py-2.5 rounded-xl"
               style={{ background: 'rgba(181,134,60,0.06)', border: '1px solid rgba(181,134,60,0.15)' }}>
            <p className="text-[10px] text-pw-ink leading-relaxed">
              💡 Ajoute tes documents dès maintenant pour les avoir toujours disponibles — même sans internet.
            </p>
          </div>
        )}
      </div>

      {/* ── PRÉAMBULE ──────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 mb-4"
           style={{ background: 'rgba(33,28,22,0.04)', border: '1px solid rgba(33,28,22,0.09)' }}>

        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: '#B5863C' }}>
            📖 Préambule
          </p>
          {!alerteVue && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                  style={{ background: 'rgba(181,134,60,0.15)', color: '#B5863C', border: '1px solid rgba(181,134,60,0.4)' }}>
              À lire
            </span>
          )}
        </div>
        <p className="text-[10px] text-pw-ink mb-4 leading-relaxed">
          Lis cette section au moins une fois — elle t'explique comment fonctionne ce livret, comment tes progrès sont évalués, et comment se déroule l'examen.
        </p>

        {/* Accordéon 1 */}
        <Accordeon
          titre="🚗 Pourquoi mieux apprendre à conduire ?"
          ouvert={accordeonOuvert === 0}
          onToggle={() => setAccordeonOuvert(accordeonOuvert === 0 ? null : 0)}
        >
          <p className="text-xs text-pw-ink leading-relaxed">
            Tu as déjà eu le permis. Tu connais la route, ses règles, ses contraintes. Tu n'es pas quelqu'un qui découvre tout.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed">
            Et pourtant, tu es là — à reprendre une formation, à repartir de zéro administrativement. Peut-être suite à une perte de points, une suspension, une annulation. Quelle qu'en soit la raison, cette étape est une vraie opportunité : celle de remettre à plat des habitudes, de regarder honnêtement ce qui n'allait pas, et de repartir avec des bases solides.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed">
            La route reste dangereuse. Et elle ne pardonne pas l'excès de confiance.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed">
            En France, des milliers de personnes perdent la vie chaque année sur la route, et des dizaines de milliers sont blessées — parfois grièvement, parfois à vie. Derrière chaque accident, il y a rarement une fatalité. Il y a le plus souvent un enchaînement de mauvais choix : vitesse mal gérée, alcool, stupéfiants, fatigue ignorée, téléphone, inattention d'une fraction de seconde.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed">
            Ce que la route ne pardonne pas, c'est le sentiment de "déjà savoir". Ce sentiment que tu as peut-être eu — comme beaucoup — avant que quelque chose se passe.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed">
            Conduire en sécurité n'est pas un acquis définitif. C'est une compétence qui s'entretient, une attention constante à soi, aux autres, à l'environnement. Ce livret ne te demande pas de tout réapprendre comme si tu étais débutant. Il te demande quelque chose de plus exigeant : regarder honnêtement ce que tu maîtrises vraiment, identifier ce qui reste fragile, et travailler précisément là où c'est nécessaire.
          </p>
          <p className="text-xs font-semibold leading-relaxed" style={{ color: '#B5863C' }}>
            Pour toi. Et pour tous ceux qui partagent la route avec toi.
          </p>
        </Accordeon>

        {/* Accordéon 2 */}
        <Accordeon
          titre="📘 Quelle est l'utilité du livret d'apprentissage ?"
          ouvert={accordeonOuvert === 1}
          onToggle={() => setAccordeonOuvert(accordeonOuvert === 1 ? null : 1)}
        >
          <p className="text-xs text-pw-ink leading-relaxed">
            Le livret d'apprentissage est un document obligatoire pour tout candidat au permis B, y compris en candidat libre. Tu dois l'avoir avec toi dans le véhicule lors de chaque séance de conduite sur voie ouverte.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed">
            Il peut être présenté à l'inspecteur (sur demande) le jour de l'épreuve pratique. Sa présentation est obligatoire lors des contrôles par les forces de l'ordre pendant tes séances d'entraînement.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed mb-1">
            Au-delà de l'obligation réglementaire, ce livret numérique est ton outil de pilotage personnel. Il te permet de :
          </p>
          {[
            'visualiser précisément où tu en es sur chacune des 30 sous-compétences du programme REMC',
            'préparer chaque séance de façon ciblée et efficace avec ton accompagnateur',
            'mesurer ta progression dans le temps, séance après séance',
            'identifier ce qui reste à consolider avant de te présenter à l\'examen',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] mt-0.5 shrink-0" style={{ color: '#B5863C' }}>—</span>
              <p className="text-xs text-pw-ink leading-relaxed">{item}</p>
            </div>
          ))}
          <p className="text-xs text-pw-ink leading-relaxed mt-1">
            Aucun volume minimum d'heures n'est exigé. Ce qui compte, c'est la maîtrise réelle des compétences — et ce livret est là pour en garder la trace rigoureuse.
          </p>
        </Accordeon>

        {/* Accordéon 3 */}
        <Accordeon
          titre="📊 Comment sont évalués mes progrès ?"
          ouvert={accordeonOuvert === 2}
          onToggle={() => setAccordeonOuvert(accordeonOuvert === 2 ? null : 2)}
        >
          <p className="text-xs text-pw-ink leading-relaxed mb-3">
            Ta progression est mesurée selon 4 niveaux, définis par le REMC :
          </p>
          {/* Tableau des 4 niveaux */}
          <div className="rounded-xl overflow-hidden mb-3"
               style={{ border: '1px solid rgba(33,28,22,0.10)' }}>
            {[
              { symbole: '',  bg: 'transparent',           border: 'rgba(33,28,22,0.22)', label: 'Non abordé',    desc: 'pas encore travaillé' },
              { symbole: '/', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.6)',   label: 'Abordé',        desc: 'travaillé mais pas encore maîtrisé', color: '#fb923c' },
              { symbole: 'X', bg: 'rgba(181,134,60,0.15)',  border: 'rgba(181,134,60,0.7)',    label: 'Traité',        desc: 'acquis dans la plupart des situations', color: '#B5863C' },
              { symbole: '■', bg: 'rgba(29,158,117,0.25)', border: 'rgba(29,158,117,0.7)',   label: 'Maîtrisé',     desc: 'restitué systématiquement et en autonomie', color: '#34d399' },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5"
                   style={{ borderBottom: i < 3 ? '1px solid rgba(33,28,22,0.06)' : 'none', background: i % 2 === 0 ? 'rgba(33,28,22,0.02)' : 'transparent' }}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-extrabold shrink-0"
                     style={{ background: n.bg, border: `2px solid ${n.border}`, color: n.color || 'transparent' }}>
                  {n.symbole}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-pw-ink">{n.label}</p>
                  <p className="text-[10px] text-pw-ink">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-pw-ink leading-relaxed mb-1">
            Pour chaque sous-compétence, 3 dimensions sont évaluées par l'inspecteur le jour de l'examen :
          </p>
          {[
            'Analyse des situations : tu perçois et comprends ce qui se passe autour de toi',
            'Adaptation aux situations : tu ajustes ta conduite en temps réel',
            'Autonomie : tu agis de façon préventive, sans avoir besoin d\'être guidé',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] mt-0.5 shrink-0" style={{ color: '#B5863C' }}>—</span>
              <p className="text-xs text-pw-ink leading-relaxed">{item}</p>
            </div>
          ))}
          <p className="text-xs text-pw-ink leading-relaxed mt-2">
            Deux éléments supplémentaires peuvent rapporter chacun 1 point bonus à l'examen : la courtoisie envers les autres usagers, et la conduite économique et respectueuse de l'environnement.
          </p>
        </Accordeon>

        {/* Accordéon 4 */}
        <Accordeon
          titre="🎯 Quel programme de formation ?"
          ouvert={accordeonOuvert === 3}
          onToggle={() => setAccordeonOuvert(accordeonOuvert === 3 ? null : 3)}
        >
          <p className="text-xs text-pw-ink leading-relaxed">
            Ta formation au permis B s'organise autour de 4 compétences et 30 sous-compétences, définies par le REMC — le Référentiel pour l'Éducation à une Mobilité Citoyenne, mis en place par l'arrêté du 13 mai 2013 en remplacement de l'ancien Programme National de Formation (PNF).
          </p>
          {[
            { id: 'C1', titre: 'Maîtriser le maniement du véhicule',          detail: 'Trafic faible ou nul — 9 sous-compétences',                       texte: "Prise en main, commandes, vérifications, trajectoires, manœuvres de base. Pour la grande majorité des candidats libres qui ont déjà conduit, les automatismes sont là. Ce livret te permet de le confirmer rapidement et de passer à l'essentiel.",                                           color: '#4dabff', solid: '#0066cc', bg: 'rgba(0,102,204,0.14)' },
            { id: 'C2', titre: 'Appréhender la route',                         detail: 'Circuler dans des conditions normales — 7 sous-compétences',        texte: "Signalisation, positionnement, intersections, priorités, stationnement. C'est souvent ici que se nichent les erreurs les plus fréquentes à l'examen — des règles précises que l'habitude a parfois déformées.",                                                                                color: '#ff77cc', solid: '#e6007e', bg: 'rgba(230,0,126,0.14)' },
            { id: 'C3', titre: 'Circuler dans des conditions difficiles',       detail: 'Partager la route avec les autres usagers — 7 sous-compétences',   texte: "Voie rapide, visibilité réduite, trafic dense, autres usagers. Les situations que l'on croit maîtriser parce qu'on les a vécues — et qui méritent pourtant d'être retravaillées avec un regard neuf.",                                                                                            color: '#ffbb55', solid: '#ff9900', bg: 'rgba(255,153,0,0.14)' },
            { id: 'C4', titre: 'Conduite autonome, sûre et écocitoyenne',      detail: 'Économique et écologique — 7 sous-compétences',                     texte: "Itinéraire en autonomie, facteurs de risque, conduite à tenir face à un accident (protéger / alerter / secourir), aides embarquées, écoconduite. Une compétence souvent sous-estimée, qui fait la différence le jour J.",                                                                      color: '#33cc66', solid: '#009933', bg: 'rgba(0,153,51,0.14)' },
          ].map(g => (
            <div key={g.id} className="rounded-xl p-3"
                 style={{ background: g.bg, border: `1px solid ${g.solid}55` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-pw-ink shrink-0"
                      style={{ background: g.solid }}>
                  {g.id}
                </span>
                <p className="text-xs font-extrabold text-pw-ink leading-snug">{g.titre}</p>
              </div>
              <p className="text-[10px] mb-1.5 font-semibold" style={{ color: g.color }}>{g.detail}</p>
              <p className="text-[10px] text-pw-ink leading-relaxed">{g.texte}</p>
            </div>
          ))}
          <p className="text-xs text-pw-ink leading-relaxed">
            Ces 4 compétences sont progressives — mais en tant que candidat libre avec une expérience de conduite, tu n'es pas obligé de les parcourir dans l'ordre. Ce livret t'aide à identifier précisément ce qui est déjà solide, et à concentrer ton énergie là où c'est vraiment nécessaire.
          </p>
        </Accordeon>

        {/* Accordéon 5 */}
        <Accordeon
          titre="🏁 Comment se déroule l'examen ?"
          ouvert={accordeonOuvert === 4}
          onToggle={() => setAccordeonOuvert(accordeonOuvert === 4 ? null : 4)}
        >
          <p className="text-xs text-pw-ink leading-relaxed">
            L'épreuve pratique est présentée individuellement, évaluée par un inspecteur du permis de conduire et de la sécurité routière (IPCSR). Elle dure <strong className="text-pw-ink">32 minutes</strong>.
          </p>
          <p className="text-xs text-pw-ink leading-relaxed mb-1">Elle comprend :</p>
          {[
            'une phase de conduite d\'au moins 25 minutes',
            '2 manœuvres : un freinage pour s\'arrêter avec précision + une manœuvre particulière (marche arrière, stationnement en bataille, créneau… selon ce que l\'inspecteur choisit)',
            'la vérification d\'un élément technique à l\'intérieur ou à l\'extérieur du véhicule',
            'une question sur la sécurité routière',
            'une question sur les premiers secours',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] mt-0.5 shrink-0" style={{ color: '#B5863C' }}>—</span>
              <p className="text-xs text-pw-ink leading-relaxed">{item}</p>
            </div>
          ))}
          <div className="mt-3 px-3 py-2.5 rounded-xl"
               style={{ background: 'rgba(181,134,60,0.07)', border: '1px solid rgba(181,134,60,0.2)' }}>
            <p className="text-[10px] font-extrabold text-pw-ink mb-1.5">🪪 Spécificités candidat libre</p>
            <p className="text-[10px] text-pw-ink leading-relaxed">
              Tu dois fournir toi-même un véhicule équipé de double commande conforme à la réglementation. Tu déclares lors de la réservation sur RdvPermis le proche qui t'accompagnera ce jour-là — il doit avoir le permis B, ne pas être professionnel de l'éducation routière, et le lien doit être établi par attestation sur l'honneur.
            </p>
          </div>
          <div className="mt-2 px-3 py-2.5 rounded-xl"
               style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)' }}>
            <p className="text-[10px] font-extrabold text-pw-ink mb-1">✅ Pour être reçu</p>
            <p className="text-[10px] text-pw-ink leading-relaxed">
              Obtenir <strong className="text-pw-ink">20 points ou plus sur 31</strong>, sans commettre d'erreur éliminatoire (franchissement ligne continue, circulation à contresens, non-respect d'un signal prescrivant l'arrêt…).
            </p>
          </div>
          <p className="text-[10px] text-pw-ink leading-relaxed mt-2">
            ℹ️ L'inspecteur ne communique pas le résultat oralement. Tu le consultes en ligne dès le lendemain sur le site de l'ANTS.
          </p>
        </Accordeon>

        {/* Bouton "J'ai lu" */}
        {!alerteVue ? (
          <button
            onClick={() => setAlerteVue('1')}
            className="w-full mt-3 py-3 rounded-full text-sm font-extrabold tap-scale glow-yellow"
            style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}
          >
            ✓ J'ai lu le préambule
          </button>
        ) : (
          <p className="text-center text-[10px] mt-3" style={{ color: '#33cc66' }}>
            ✓ Préambule lu
          </p>
        )}
      </div>

      <p className="text-center text-[10px] text-pw-ink-soft/25 mt-2 leading-relaxed">
        Données conservées uniquement sur ton téléphone<br />
        Permis Webi © 2026 — Marion Falquerho
      </p>
    </div>
  )
}
