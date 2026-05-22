// Onglet 4 — Profil candidat (V1.0 — champs étendus + mode présentation)
import { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ModePresentation from './ModePresentation'

const CHAMPS = [
  { id: 'nom',           label: 'Nom',                     type: 'text',  placeholder: 'Dupont' },
  { id: 'prenom',        label: 'Prénom',                   type: 'text',  placeholder: 'Karim' },
  { id: 'dateNaissance', label: 'Date de naissance',        type: 'date',  placeholder: '' },
  { id: 'neph',          label: 'Numéro NEPH',             type: 'text',  placeholder: '123456789012', maxLength: 12 },
  { id: 'dateANTS',      label: 'Dossier ANTS validé le',  type: 'date',  placeholder: '', optionnel: true },
  { id: 'adresse',       label: 'Adresse complète',         type: 'text',  placeholder: '12 rue de la Paix, 75001 Paris' },
  { id: 'telephone',     label: 'Téléphone',                type: 'tel',   placeholder: '06 12 34 56 78' },
  { id: 'email',         label: 'Email',                    type: 'email', placeholder: 'karim.dupont@email.fr' },
]

export default function Profil({ ouvrirPresentation }) {
  const [profil, setProfil] = useLocalStorage('pw_profil', {})
  const [photo, setPhoto] = useLocalStorage('pw_photo', null)
  const [etats] = useLocalStorage('pw_competences', {})
  const [seances] = useLocalStorage('pw_seances', [])
  const [modeEdition, setModeEdition] = useState(!profil.nom)
  const [draft, setDraft] = useState(profil)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installe, setInstalle] = useState(false)
  const [showPresentation, setShowPresentation] = useState(!!ouvrirPresentation)
  const fileRef = useRef()

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (ouvrirPresentation) setShowPresentation(true)
  }, [ouvrirPresentation])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => { setProfil(draft); setModeEdition(false) }

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstalle(true); setInstallPrompt(null) }
  }

  // Mode présentation plein écran fond blanc
  if (showPresentation) {
    return (
      <ModePresentation
        profil={profil} photo={photo} etats={etats} seances={seances}
        onQuitter={() => setShowPresentation(false)}
      />
    )
  }

  const profilComplet = profil.nom && profil.prenom && profil.neph

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="text-center mb-5">
        <h1 className="text-xl font-extrabold text-white">Mon profil</h1>
        <p className="text-xs text-white/50 mt-1">Remplis tes infos une seule fois — elles restent sur ton téléphone</p>
      </div>

      {/* Bouton mode présentation */}
      <button onClick={() => setShowPresentation(true)}
              className="w-full mb-4 py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: 'rgba(255,190,0,0.12)', border: '1px solid rgba(255,190,0,0.4)', color: '#FFBE00' }}>
        🪪 Mode présentation — Contrôle / Examen
      </button>

      {/* PWA install */}
      {installPrompt && !installe && (
        <button onClick={handleInstall}
                className="w-full mb-4 py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,190,0,0.1)', border: '1px solid rgba(255,190,0,0.3)', color: '#FFBE00' }}>
          📲 Installer le livret sur mon écran d'accueil
        </button>
      )}
      {!installPrompt && !installe && (
        <div className="mb-4 px-3 py-2.5 rounded-xl text-xs text-white/50 text-center"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          📱 iPhone : Menu <strong className="text-white/70">Partager</strong> → <strong className="text-white/70">Ajouter à l'écran d'accueil</strong>
        </div>
      )}

      {/* Carte profil */}
      {!modeEdition && profilComplet && (
        <div className="rounded-2xl overflow-hidden mb-4"
             style={{ background: 'linear-gradient(135deg, #0d1b3e, #07111f)', border: '1px solid rgba(255,190,0,0.35)' }}>
          <div className="px-4 pt-4 pb-3 flex items-center justify-between"
               style={{ borderBottom: '1px solid rgba(255,190,0,0.2)' }}>
            <div className="flex items-center gap-2">
              <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
                   alt="Permis Webi" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: '#FFBE00' }}>Permis Webi</p>
                <p className="text-[9px] text-white/50 uppercase tracking-wide">Livret d'apprentissage</p>
              </div>
            </div>
            <div className="text-[9px] font-bold px-2 py-1 rounded-full"
                 style={{ background: 'rgba(255,190,0,0.15)', color: '#FFBE00', border: '1px solid rgba(255,190,0,0.35)' }}>
              Candidat libre
            </div>
          </div>
          <div className="px-4 py-4 flex gap-4">
            <div className="w-20 h-24 min-w-[80px] rounded-xl overflow-hidden flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <span className="text-3xl">👤</span>}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-lg font-extrabold text-white leading-tight truncate">
                {profil.prenom} {profil.nom?.toUpperCase()}
              </p>
              {profil.dateNaissance && (
                <p className="text-xs text-white/60">
                  Né·e le {new Date(profil.dateNaissance).toLocaleDateString('fr-FR')}
                </p>
              )}
              {profil.neph && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                     style={{ background: 'rgba(255,190,0,0.15)', color: '#FFBE00', border: '1px solid rgba(255,190,0,0.35)' }}>
                  NEPH {profil.neph}
                </div>
              )}
              {profil.adresse && <p className="text-xs text-white/60 truncate">{profil.adresse}</p>}
            </div>
          </div>
          <div className="px-4 py-2 text-[9px] text-white/30"
               style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            Conforme REMC — Arrêté du 29 juillet 2013
          </div>
        </div>
      )}

      {/* Formulaire */}
      {(modeEdition || !profilComplet) && (
        <div className="rounded-2xl p-4 mb-4"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
          {/* Photo */}
          <div className="flex flex-col items-center mb-5">
            <div onClick={() => fileRef.current.click()}
                 className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer mb-2 transition-all hover:opacity-80"
                 style={{ border: '2px dashed rgba(255,190,0,0.5)', background: 'rgba(255,190,0,0.08)' }}>
              {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <span className="text-3xl">📸</span>}
            </div>
            <button onClick={() => fileRef.current.click()} className="text-xs font-semibold" style={{ color: '#FFBE00' }}>
              {photo ? 'Changer la photo' : 'Ajouter ma photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhoto} />
          </div>

          {CHAMPS.map(c => (
            <div key={c.id} className="mb-3">
              <label className="text-xs font-bold uppercase tracking-wide text-white/60 mb-1 block">
                {c.label}
                {c.id === 'neph' && <span className="text-white/40 normal-case font-normal ml-1">(12 chiffres)</span>}
                {c.optionnel && <span className="text-white/30 normal-case font-normal ml-1">(optionnel)</span>}
              </label>
              <input type={c.type} value={draft[c.id] || ''}
                     onChange={e => setDraft(d => ({ ...d, [c.id]: e.target.value }))}
                     placeholder={c.placeholder} maxLength={c.maxLength}
                     className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                     style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', colorScheme: c.type === 'date' ? 'dark' : undefined }}
                     onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                     onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              {c.id === 'neph' && draft.neph && draft.neph.length !== 12 && (
                <p className="text-xs text-orange-400 mt-0.5">Le NEPH doit contenir exactement 12 chiffres</p>
              )}
            </div>
          ))}

          <button onClick={handleSave}
                  className="w-full py-3 rounded-full font-extrabold text-sm mt-2 transition-all active:scale-95"
                  style={{ background: '#FFBE00', color: '#07111f' }}>
            ✅ Enregistrer mon profil
          </button>
        </div>
      )}

      {/* Modifier profil */}
      {!modeEdition && profilComplet && (
        <button onClick={() => { setDraft(profil); setModeEdition(true) }}
                className="w-full mt-2 py-2.5 rounded-full text-xs font-bold transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
          ✏️ Modifier mon profil
        </button>
      )}

      <p className="text-center text-[10px] text-white/25 mt-5 leading-relaxed">
        Données conservées uniquement sur ton téléphone<br />
        Permis Webi © 2026 — Marion Falquerho
      </p>
    </div>
  )
}
