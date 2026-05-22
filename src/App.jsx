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
  // Paramètre optionnel passé à la page cible (groupe C2, mode présentation, nouvelle séance…)
  const [tabParam, setTabParam] = useState(null)

  // Consentement RGPD — null si jamais consenti ou version obsolète
  const consent = useConsent()
  const [showConsent, setShowConsent] = useState(!consent)

  const navigate = (tab, param = null) => {
    setActiveTab(tab)
    setTabParam(param)
  }

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: '72px' }}>

        {activeTab === 'dashboard'   && <Dashboard onNavigate={navigate} />}
        {activeTab === 'competences' && <Competences groupeInitial={tabParam || 'C1'} />}
        {activeTab === 'seances'     && <Seances ouvrirForm={tabParam === 'new'} />}
        {activeTab === 'profil'      && <Profil ouvrirPresentation={tabParam === 'presentation'} />}

      </main>

      <NavBar activeTab={activeTab} onTabChange={(tab) => navigate(tab)} />

      {/* Bandeau RGPD — affiché uniquement si aucun consentement valide n'est stocké */}
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
