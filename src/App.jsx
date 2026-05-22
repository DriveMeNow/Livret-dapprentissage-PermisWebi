// App principale — V1.0 — 4 onglets avec navigation entre vues
import { useState } from 'react'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Competences from './pages/Competences'
import Seances from './pages/Seances'
import Profil from './pages/Profil'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  // Paramètre optionnel passé à la page cible (ex: groupe C2, mode présentation, nouvelle séance)
  const [tabParam, setTabParam] = useState(null)

  // Navigation avec paramètre optionnel
  const navigate = (tab, param = null) => {
    setActiveTab(tab)
    setTabParam(param)
  }

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: '72px' }}>

        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={navigate} />
        )}

        {activeTab === 'competences' && (
          <Competences groupeInitial={tabParam || 'C1'} />
        )}

        {activeTab === 'seances' && (
          <Seances ouvrirForm={tabParam === 'new'} />
        )}

        {activeTab === 'profil' && (
          <Profil ouvrirPresentation={tabParam === 'presentation'} />
        )}

      </main>

      <NavBar activeTab={activeTab} onTabChange={(tab) => navigate(tab)} />
    </div>
  )
}
