/**
 * NavBar — Barre de navigation fixe premium
 * Glassmorphisme + pill indicator + safe-area iPhone
 * Icônes SVG (respectent la couleur CSS, pas d'emoji incontrôlable)
 */

const IconProfil = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

const TABS = [
  { id: 'dashboard',   label: 'Accueil',  icon: '🧭', Icon: null       },
  { id: 'competences', label: 'Livret',   icon: '📋', Icon: null       },
  { id: 'seances',     label: 'Séances',  icon: '▶',  Icon: null       },
  { id: 'profil',      label: 'Profil',   icon: null, Icon: IconProfil },
]

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,253,249,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid #E8DFD0',
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
                color: isActive ? '#B5863C' : '#6E665A',
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
                    background: 'rgba(181,134,60,0.12)',
                    border: '1px solid rgba(181,134,60,0.25)',
                  }}
                />
              )}

              {/* Icône */}
              <span
                className="relative z-10 leading-none flex items-center justify-center"
                style={{
                  fontSize: '18px',
                  transform: isActive ? 'scale(1.18)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                {tab.Icon ? <tab.Icon /> : tab.icon}
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
                  color: isActive ? '#B5863C' : '#6E665A',
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
                    background: '#B5863C',
                    borderRadius: '3px 3px 0 0',
                    boxShadow: '0 0 8px rgba(149,112,37,0.45)',
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
