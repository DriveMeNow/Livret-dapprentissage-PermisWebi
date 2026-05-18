// Onglet 2 — Profil candidat
// TON : Permis Webi — chaleureux, tutoiement

import { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CHAMPS = [
  { id: 'nom',      label: 'Nom',           type: 'text',  placeholder: 'Dupont' },
  { id: 'prenom',   label: 'Prénom',         type: 'text',  placeholder: 'Marie' },
  { id: 'neph',     label: 'Numéro NEPH',   type: 'text',  placeholder: '123456789012', maxLength: 12, pattern: '[0-9]{12}' },
  { id: 'adresse',  label: 'Adresse',        type: 'text',  placeholder: '12 rue de la Paix, 75001 Paris' },
  { id: 'telephone',label: 'Téléphone',      type: 'tel',   placeholder: '06 12 34 56 78' },
  { id: 'email',    label: 'Email',          type: 'email', placeholder: 'marie.dupont@email.fr' },
]

export default function Profil() {
  const [profil, setProfil] = useLocalStorage('pw_profil', {})
  const [photo, setPhoto] = useLocalStorage('pw_photo', null)
  const [modeEdition, setModeEdition] = useState(!profil.nom)
  const [draft, setDraft] = useState(profil)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installe, setInstalle] = useState(false)
  const fileRef = useRef()

  // Capture l'événement PWA d'installation
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setProfil(draft)
    setModeEdition(false)
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstalle(true); setInstallPrompt(null) }
  }

  const profilComplet = profil.nom && profil.prenom && profil.neph

  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-5 pb-6">

      {/* En-tête */}
      <div className="text-center mb-5">
        <h1 className="text-xl font-extrabold text-white">Mon profil</h1>
        <p className="text-xs text-white/50 mt-1">Remplis tes infos une seule fois — elles restent sur ton téléphone</p>
      </div>

      {/* Bouton install PWA — Android/Chrome */}
      {installPrompt && !installe && (
        <button onClick={handleInstall}
                className="w-full mb-4 py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{ background: 'rgba(255,190,0,0.15)', border: '1px solid rgba(255,190,0,0.45)', color: '#FFBE00' }}>
          📲 Installer le livret sur mon écran d'accueil
        </button>
      )}

      {/* Note iOS */}
      {!installPrompt && !installe && (
        <div className="mb-4 px-3 py-2.5 rounded-xl text-xs text-white/50 text-center"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          📱 Sur iPhone : Menu <strong className="text-white/70">Partager</strong> puis <strong className="text-white/70">Ajouter à l'écran d'accueil</strong>
        </div>
      )}

      {/* Mode affichage — Carte d'identité */}
      {!modeEdition && profilComplet ? (
        <CarteIdentite profil={profil} photo={photo} onEdit={() => setModeEdition(true)} />
      ) : (
        /* Mode formulaire */
        <div className="rounded-2xl p-4 mb-4"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>

          {/* Photo */}
          <div className="flex flex-col items-center mb-5">
            <div onClick={() => fileRef.current.click()}
                 className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer mb-2 transition-all hover:opacity-80"
                 style={{ border: '2px dashed rgba(255,190,0,0.5)', background: 'rgba(255,190,0,0.08)' }}>
              {photo
                ? <img src={photo} alt="Photo" className="w-full h-full object-cover" />
                : <span className="text-3xl">📸</span>
              }
            </div>
            <button onClick={() => fileRef.current.click()}
                    className="text-xs font-semibold"
                    style={{ color: '#FFBE00' }}>
              {photo ? 'Changer la photo' : 'Ajouter ma photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="user"
                   className="hidden" onChange={handlePhoto} />
          </div>

          {/* Champs */}
          {CHAMPS.map(c => (
            <div key={c.id} className="mb-3">
              <label className="text-xs font-bold uppercase tracking-wide text-white/60 mb-1 block">
                {c.label}
                {c.id === 'neph' && <span className="text-white/40 normal-case tracking-normal font-normal ml-1">(12 chiffres)</span>}
              </label>
              <input
                type={c.type}
                value={draft[c.id] || ''}
                onChange={e => setDraft(d => ({ ...d, [c.id]: e.target.value }))}
                placeholder={c.placeholder}
                maxLength={c.maxLength}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,190,0,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
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
    </div>
  )
}

// Carte d'identité affichée après remplissage
function CarteIdentite({ profil, photo, onEdit }) {
  return (
    <div className="mb-4">
      {/* Carte style document officiel */}
      <div className="rounded-2xl overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0d1b3e, #07111f)', border: '1px solid rgba(255,190,0,0.35)' }}>

        {/* Header carte */}
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
          <div className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
               style={{ background: 'rgba(255,190,0,0.15)', color: '#FFBE00', border: '1px solid rgba(255,190,0,0.35)' }}>
            Candidat libre
          </div>
        </div>

        {/* Corps carte */}
        <div className="px-4 py-4 flex gap-4">
          {/* Photo */}
          <div className="w-20 h-24 min-w-[80px] rounded-xl overflow-hidden flex items-center justify-center"
               style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {photo
              ? <img src={photo} alt="Photo" className="w-full h-full object-cover" />
              : <span className="text-3xl">👤</span>
            }
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-extrabold text-white leading-tight truncate">
              {profil.prenom} {profil.nom?.toUpperCase()}
            </p>
            <div className="mt-2 space-y-1">
              <LigneInfo label="NEPH" value={profil.neph} highlight />
              {profil.adresse && <LigneInfo label="Adresse" value={profil.adresse} />}
              {profil.telephone && <LigneInfo label="Tél." value={profil.telephone} />}
              {profil.email && <LigneInfo label="Email" value={profil.email} />}
            </div>
          </div>
        </div>

        {/* Footer carte */}
        <div className="px-4 py-2 text-[9px] text-white/30"
             style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          Document à présenter aux forces de l'ordre lors des séances de conduite
        </div>
      </div>

      <button onClick={onEdit}
              className="w-full mt-3 py-2.5 rounded-full text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
        ✏️ Modifier mon profil
      </button>
    </div>
  )
}

function LigneInfo({ label, value, highlight }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9px] uppercase tracking-wide text-white/40 shrink-0">{label}</span>
      <span className={`text-xs font-semibold truncate ${highlight ? 'text-[#FFBE00]' : 'text-white/80'}`}>{value}</span>
    </div>
  )
}
