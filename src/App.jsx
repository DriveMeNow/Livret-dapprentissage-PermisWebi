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

/** Onglet de démarrage — Profil si premier lancement, Dashboard sinon */
const getInitialTab = () =>
  localStorage.getItem('pw_preambule_alerte_vue') ? 'dashboard' : 'profil'

/** Contenu principal — séparé pour bénéficier de l'ErrorBoundary parent */
function AppInner() {
  const [activeTab, setActiveTab] = useState(getInitialTab)
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
             style={{ background: 'rgba(33,28,22,0.45)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-scaleIn"
               style={{ background: '#FFFDF9', border: '1px solid #E8DFD0', boxShadow: '0 12px 32px rgba(33,28,22,0.16)' }}>
            <div className="text-3xl text-center mb-3">📖</div>
            <p className="text-base font-extrabold text-pw-ink mb-2 text-center">
              Tu n'as pas encore lu le préambule
            </p>
            <p className="text-sm text-pw-ink leading-relaxed mb-5 text-center">
              Le préambule explique comment fonctionne ce livret, comment sont évalués tes progrès
              et comment se déroule l'examen. C'est important de le lire au moins une fois.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setConfirmNav(null)}
                className="w-full py-3 rounded-full text-sm font-extrabold tap-scale"
                style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}
              >
                📖 Lire le préambule maintenant
              </button>
              <button
                onClick={validerNavigation}
                className="w-full py-2.5 rounded-full text-sm font-bold"
                style={{ background: 'transparent', border: '1px solid #E8DFD0', color: '#6E665A' }}
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
