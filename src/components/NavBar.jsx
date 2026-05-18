// Barre de navigation fixe en bas de l'écran — 5 onglets

const TABS = [
  { id: 'preambule',   label: 'Préambule',   emoji: '📋' },
  { id: 'profil',      label: 'Profil',       emoji: '👤' },
  { id: 'competences', label: 'Compétences',  emoji: '✅' },
  { id: 'seances',     label: 'Séances',      emoji: '📝' },
  { id: 'debrief',     label: 'Débrief',      emoji: '💬' },
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
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all duration-200 ${
                isActive ? 'text-[#FFBE00]' : 'text-white/40 hover:text-white/70'
              }`}
              style={{ minHeight: '56px' }}
            >
              <span className="text-lg leading-none">{tab.emoji}</span>
              <span className={`text-[9px] font-700 uppercase tracking-wide leading-none mt-0.5 ${
                isActive ? 'font-extrabold' : 'font-medium'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#FFBE00]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
