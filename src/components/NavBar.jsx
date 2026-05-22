/**
 * NavBar — Barre de navigation fixe premium
 * Glassmorphisme + pill indicator + safe-area iPhone
 */

const TABS = [
  { id: 'dashboard',   label: 'Accueil',  icon: '🧭' },
  { id: 'competences', label: 'Livret',   icon: '📋' },
  { id: 'seances',     label: 'Séances',  icon: '▶' },
  { id: 'profil',      label: 'Profil',   icon: '👤' },
]

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(5,12,26,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex max-w-lg mx-auto">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 relative tap-scale"
              style={{
                minHeight: '62px',
                color: isActive ? '#FFBE00' : 'rgba(255,255,255,0.72)',
                transition: 'color 0.2s ease',
              }}
            >
              {/* Fond pill quand actif */}
              {isActive && (
                <span
                  className="absolute inset-x-3 rounded-2xl"
                  style={{
                    top: '6px',
                    bottom: '10px',
                    background: 'rgba(255,190,0,0.1)',
                    border: '1px solid rgba(255,190,0,0.18)',
                  }}
                />
              )}

              {/* Icône */}
              <span
                className="relative z-10 leading-none"
                style={{
                  fontSize: '18px',
                  transform: isActive ? 'scale(1.18)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                {tab.icon}
              </span>

              {/* Label */}
              <span
                className="relative z-10 leading-none"
                style={{
                  fontSize: '9px',
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  color: isActive ? '#FFBE00' : 'rgba(255,255,255,0.72)',
                }}
              >
                {tab.label}
              </span>

              {/* Barre indicateur bas */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: '20px',
                    height: '3px',
                    background: '#FFBE00',
                    borderRadius: '3px 3px 0 0',
                    boxShadow: '0 0 8px rgba(255,190,0,0.5)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
