// App principale — navigation 5 onglets
import { useState } from 'react'
import NavBar from './components/NavBar'
import Preambule from './pages/Preambule'
import Profil from './pages/Profil'
import Competences from './pages/Competences'
import Seances from './pages/Seances'
import Debrief from './pages/Debrief'

const PAGES = {
  preambule:   <Preambule />,
  profil:      <Profil />,
  competences: <Competences />,
  seances:     <Seances />,
  debrief:     <Debrief />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('profil')

  return (
    <div className="flex flex-col h-full">
      {/* Zone de contenu — prend tout l'espace au-dessus de la NavBar */}
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: '72px' }}>
        {/* On garde tous les onglets montés pour préserver l'état scroll */}
        {Object.entries(PAGES).map(([id, page]) => (
          <div key={id}
               className="h-full"
               style={{ display: activeTab === id ? 'block' : 'none' }}>
            {page}
          </div>
        ))}
      </main>

      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
