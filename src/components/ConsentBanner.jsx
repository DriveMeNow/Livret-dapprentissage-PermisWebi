/**
 * Bandeau de consentement RGPD — Livret Permis Webi
 * Conforme RGPD (Règlement UE 2016/679) et recommandations CNIL
 * Deux catégories distinctes : essentiel (toujours actif) / analytics (optionnel)
 */
import { useState } from 'react'

const CONSENT_KEY = 'pw_rgpd_consent'
const CONSENT_VERSION = '1.0' // Incrémenter si la politique change

export function useConsent() {
  const stored = (() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      // Invalider si version obsolète
      if (parsed.version !== CONSENT_VERSION) return null
      return parsed
    } catch { return null }
  })()
  return stored
}

export function saveConsent(analytics, marketing) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      version:   CONSENT_VERSION,
      date:      new Date().toISOString(),
      essential: true,        // Toujours activé — nécessaire au fonctionnement
      analytics: !!analytics, // Google Analytics 4 (si activé)
      marketing: !!marketing, // Tracking marketing (futur)
    }))
    // Activer GA4 si consentement analytics
    if (analytics) activateGA4()
  } catch { /* localStorage indisponible — continuer sans consentement stocké */ }
}

function activateGA4() {
  // Placeholder GA4 — remplacer 'G-XXXXXXXXXX' par le vrai ID de mesure
  const GA_ID = 'G-XXXXXXXXXX'
  if (GA_ID === 'G-XXXXXXXXXX') return // Pas encore configuré
  if (document.getElementById('ga4-script')) return // Déjà chargé
  const script = document.createElement('script')
  script.id = 'ga4-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID, { anonymize_ip: true })
}

export default function ConsentBanner({ onClose }) {
  const [showDetail, setShowDetail] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  const acceptAll = () => {
    saveConsent(true, true)
    onClose()
  }

  const acceptEssential = () => {
    saveConsent(false, false)
    onClose()
  }

  const saveChoice = () => {
    saveConsent(analytics, false)
    onClose()
  }

  if (showPolicy) return <PrivacyPolicy onBack={() => setShowPolicy(false)} />

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center"
         style={{ background: 'rgba(33,28,22,0.7)', backdropFilter: 'blur(4px)' }}>

      <div className="w-full max-w-lg animate-slideUp"
           style={{
             background: '#FFFDF9',
             border: '1px solid #E8DFD0',
             borderBottom: 'none',
             borderRadius: '24px 24px 0 0',
             padding: '24px 20px',
             paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
           }}>

        {/* Logo + titre */}
        <div className="flex items-center gap-3 mb-4">
          <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
               alt="Permis Webi" className="w-9 h-9 rounded-full" />
          <div>
            <p className="text-sm font-extrabold text-pw-ink">Respect de ta vie privée</p>
            <p className="text-[10px] text-pw-ink">Permis Webi — Livret d'apprentissage</p>
          </div>
        </div>

        <p className="text-xs text-pw-ink leading-relaxed mb-4">
          Cette application stocke uniquement les données que tu saisis <strong className="text-pw-ink">sur ton téléphone</strong>.
          Aucune donnée personnelle n'est transmise à des tiers sans ton accord.
          Nous pouvons utiliser des outils d'analyse anonymisés pour améliorer l'app.
        </p>

        {/* Mode détaillé */}
        {showDetail && (
          <div className="mb-4 p-3 rounded-xl space-y-3"
               style={{ background: '#f8f2e5', border: '1px solid #E8DFD0' }}>

            {/* Essentiel — toujours actif */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-xs font-bold text-pw-ink">🔒 Cookies essentiels</p>
                <p className="text-[10px] text-pw-ink mt-0.5">Fonctionnement de l'app, sauvegarde locale. Toujours actifs.</p>
              </div>
              <div className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                   style={{ background: 'rgba(29,158,117,0.2)', color: '#34d399', border: '1px solid rgba(29,158,117,0.4)' }}>
                Actif
              </div>
            </div>

            {/* Analytics — optionnel */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-xs font-bold text-pw-ink">📊 Analytics anonymisés</p>
                <p className="text-[10px] text-pw-ink mt-0.5">Statistiques d'utilisation pour améliorer l'app. IP anonymisée.</p>
              </div>
              <button
                onClick={() => setAnalytics(v => !v)}
                className="relative w-10 h-5.5 rounded-full transition-all shrink-0"
                style={{
                  background: analytics ? '#B5863C' : 'rgba(33,28,22,0.15)',
                  width: '40px', height: '22px',
                }}>
                <span className="absolute top-0.5 rounded-full bg-pw-paper transition-all"
                      style={{
                        width: '18px', height: '18px',
                        left: analytics ? '20px' : '2px',
                        transition: 'left 0.2s ease',
                      }} />
              </button>
            </div>
          </div>
        )}

        {/* Boutons */}
        <div className="flex flex-col gap-2">
          <button onClick={acceptAll}
                  className="w-full py-3 rounded-full font-extrabold text-sm tap-scale glow-yellow"
                  style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
            Tout accepter
          </button>
          <div className="flex gap-2">
            {showDetail ? (
              <button onClick={saveChoice}
                      className="flex-1 py-2.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(33,28,22,0.08)', border: '1px solid rgba(33,28,22,0.12)', color: '#211C16' }}>
                Enregistrer mon choix
              </button>
            ) : (
              <button onClick={() => setShowDetail(true)}
                      className="flex-1 py-2.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(33,28,22,0.08)', border: '1px solid rgba(33,28,22,0.12)', color: '#211C16' }}>
                Personnaliser
              </button>
            )}
            <button onClick={acceptEssential}
                    className="flex-1 py-2.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(33,28,22,0.05)', border: '1px solid rgba(33,28,22,0.08)', color: '#211C16' }}>
              Refuser
            </button>
          </div>
        </div>

        {/* Lien politique */}
        <p className="text-center text-[10px] text-pw-ink-soft/30 mt-3">
          <button onClick={() => setShowPolicy(true)} className="underline hover:text-pw-ink transition-colors">
            Politique de confidentialité & CGU
          </button>
        </p>
      </div>
    </div>
  )
}

/* ─── Politique de confidentialité + CGU ───────────────── */
function PrivacyPolicy({ onBack }) {
  return (
    <div className="fixed inset-0 z-[210] overflow-y-auto"
         style={{ background: 'linear-gradient(160deg, #f8f2e5, #f8f2e5)' }}>
      <div className="max-w-lg mx-auto px-5 py-6 pb-16">

        {/* En-tête */}
        <button onClick={onBack}
                className="flex items-center gap-2 mb-5 text-sm text-pw-ink hover:text-pw-ink transition-colors">
          ← Retour
        </button>
        <div className="flex items-center gap-3 mb-6">
          <img src="https://d1yei2z3i6k35z.cloudfront.net/13456335/687fb09be66ff_logorondfinalvolantclé.png"
               alt="Permis Webi" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#B5863C' }}>Permis Webi</p>
            <p className="text-base font-extrabold text-pw-ink">Politique de confidentialité & CGU</p>
          </div>
        </div>

        {/* Sections */}
        {[
          {
            titre: '1. Responsable du traitement',
            contenu: `Marion Falquerho — Entrepreneuse individuelle
SIREN : 992 387 894
6 rue d'Armaille, 75017 Paris
Contact : via permiswebi.fr`
          },
          {
            titre: '2. Données collectées et finalités',
            contenu: `Les données saisies dans le livret (nom, prénom, date de naissance, adresse, téléphone, email, numéro NEPH, photo, progression des compétences, historique des séances) sont stockées UNIQUEMENT sur ton appareil (localStorage du navigateur).

Elles ne sont transmises à aucun serveur ni à aucun tiers. Elles servent exclusivement à ton usage personnel du livret d'apprentissage.`
          },
          {
            titre: '3. Durée de conservation',
            contenu: `Tes données sont conservées indéfiniment dans le stockage local de ton navigateur, jusqu'à ce que tu les supprimes manuellement (via les paramètres du navigateur) ou que tu réinitialises l'application.`
          },
          {
            titre: '4. Cookies et analytics',
            contenu: `Si tu as accepté les cookies analytics, nous utilisons Google Analytics 4 avec IP anonymisée pour améliorer l'application. Aucun cookie publicitaire n'est déposé sans ton accord explicite.

Tu peux retirer ton consentement à tout moment en réinitialisant les préférences de l'application.`
          },
          {
            titre: '5. Tes droits RGPD',
            contenu: `Conformément au Règlement (UE) 2016/679 (RGPD), tu disposes des droits suivants :
• Droit d'accès à tes données
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la portabilité
• Droit d'opposition au traitement

Pour exercer ces droits : contact via permiswebi.fr
Tu peux également déposer une réclamation auprès de la CNIL (cnil.fr).`
          },
          {
            titre: '6. Conditions générales d\'utilisation',
            contenu: `Le livret d'apprentissage numérique Permis Webi est un outil pédagogique conforme au Référentiel pour l'Éducation à une Mobilité Citoyenne (REMC — Arrêté du 13 mai 2013).

Son utilisation est réservée aux candidats libres inscrits à la formation Permis Webi. Il ne remplace pas les documents officiels requis par les autorités compétentes.

Permis Webi décline toute responsabilité en cas d'usage non conforme de cet outil.`
          },
          {
            titre: '7. Sécurité',
            contenu: `L'application est servie exclusivement en HTTPS. Les données sont stockées localement sur ton appareil et ne transitent pas sur nos serveurs. Nous appliquons les recommandations OWASP pour la sécurité des applications web.`
          },
        ].map((s, i) => (
          <div key={i} className="mb-5 p-4 rounded-2xl"
               style={{ background: '#FFFDF9', border: '1px solid #E8DFD0' }}>
            <p className="text-xs font-extrabold text-pw-ink mb-2">{s.titre}</p>
            <p className="text-xs text-pw-ink leading-relaxed whitespace-pre-line">{s.contenu}</p>
          </div>
        ))}

        <p className="text-center text-[10px] text-pw-ink-soft/30 mt-4">
          Version 1.0 — Mai 2026<br />
          Permis Webi © 2026 — Marion Falquerho
        </p>

        <button onClick={onBack}
                className="w-full mt-5 py-3 rounded-full font-extrabold text-sm tap-scale"
                style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
          J'ai compris — Retour à l'app
        </button>
      </div>
    </div>
  )
}
