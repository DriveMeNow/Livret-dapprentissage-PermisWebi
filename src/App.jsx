/**
 * App principale — V1.0
 * 4 onglets + ErrorBoundary OWASP + Bandeau RGPD
 */
import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import ConsentBanner, { useConsent } from './components/ConsentBanner'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Competences from './pages/Competences'
import Seances from './pages/Seances'
import Profil from './pages/Profil'

/** Contenu principal — séparé pour bénéficier de l'ErrorBoundary parent */
function AppInner() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tabParam, setTabParam] = useState(null)
  const consent = useConsent()
  const [showConsent, setShowConsent] = useState(!consent)

  // Navigation en attente de confirmation (alerte préambule — première visite Profil)
  const [confirmNav, setConfirmNav] = useState(null)

  const navigate = (tab, param = null) => {
    // Si on quitte l'onglet Profil et que l'alerte n'a jamais été montrée → interception
    if (activeTab === 'profil' && tab !== 'profil') {
      const alerteVue = localStorage.getItem('pw_preambule_alerte_vue')
      if (!alerteVue) {
        localStorage.setItem('pw_preambule_alerte_vue', '1')
        setConfirmNav({ tab, param })
        return
      }
    }
    setActiveTab(tab)
    setTabParam(param)
  }

  const validerNavigation = () => {
    if (!confirmNav) return
    setActiveTab(confirmNav.tab)
    setTabParam(confirmNav.param)
    setConfirmNav(null)
  }

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: '72px' }}>

        {activeTab === 'dashboard'   && <Dashboard onNavigate={navigate} />}
        {activeTab === 'competences' && <Competences groupeInitial={tabParam} />}
        {activeTab === 'seances'     && <Seances ouvrirForm={tabParam === 'new'} />}
        {activeTab === 'profil'      && <Profil ouvrirPresentation={tabParam === 'presentation'} />}

      </main>

      <NavBar activeTab={activeTab} onTabChange={(tab) => navigate(tab)} />

      {/* ── Modal alerte préambule — première sortie de l'onglet Profil ── */}
      {confirmNav && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-5"
             style={{ background: 'rgba(7,17,31,0.96)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-scaleIn"
               style={{ background: 'linear-gradient(135deg, #0d1b3e, #07111f)', border: '1px solid rgba(255,190,0,0.35)' }}>
            <div className="text-3xl text-center mb-3">📖</div>
            <p className="text-base font-extrabold text-white mb-2 text-center">
              Tu n'as pas encore lu le préambule
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-5 text-center">
              Le préambule explique comment fonctionne ce livret, comment sont évalués tes progrès
              et comment se déroule l'examen. C'est important de le lire au moins une fois.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setConfirmNav(null)}
                className="w-full py-3 rounded-full text-sm font-extrabold tap-scale glow-yellow"
                style={{ background: '#FFBE00', color: '#07111f' }}
              >
                📖 Lire le préambule maintenant
              </button>
              <button
                onClick={validerNavigation}
                className="w-full py-2.5 rounded-full text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}
              >
                Continuer sans lire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bandeau RGPD */}
      {showConsent && (
        <ConsentBanner onClose={() => setShowConsent(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  )
}
