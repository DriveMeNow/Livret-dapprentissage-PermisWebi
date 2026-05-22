// Barre de navigation fixe — 4 onglets (V1.0)
const TABS = [
  { id: 'dashboard',   label: 'Accueil',    emoji: '🧭' },
  { id: 'competences', label: 'Mon livret', emoji: '📋' },
  { id: 'seances',     label: 'Séances',    emoji: '▶' },
  { id: 'profil',      label: 'Profil',     emoji: '👤' },
]

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
         style={{ background: 'rgba(7,17,31,0.97)', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
      <div className="flex">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-all duration-200"
              style={{ minHeight: '56px', color: isActive ? '#FFBE00' : 'rgba(255,255,255,0.4)' }}>
              <span className="text-lg leading-none">{tab.emoji}</span>
              <span className={`text-[9px] uppercase tracking-wide leading-none mt-0.5 ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{ background: '#FFBE00' }} />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
