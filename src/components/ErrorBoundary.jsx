/**
 * ErrorBoundary — Capture les erreurs React sans afficher de message système brut
 * Conforme OWASP A09 (Security Logging) et bonnes pratiques UX
 */
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorId: null }
  }

  static getDerivedStateFromError() {
    // Génère un ID d'erreur pour le support, sans exposer les détails techniques
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`
    return { hasError: true, errorId }
  }

  componentDidCatch(error, info) {
    // Log discret en console développeur uniquement (jamais affiché à l'utilisateur)
    if (typeof console !== 'undefined') {
      console.error('[Livret PW] Erreur capturée:', error?.message || 'Inconnue')
      console.error('[Livret PW] Composant:', info?.componentStack?.split('\n')[1]?.trim() || 'Inconnu')
    }
    // En production, ici on enverrait à un service de monitoring (ex: Sentry)
  }

  handleReset = () => {
    this.setState({ hasError: false, errorId: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center px-6"
             style={{ background: 'linear-gradient(160deg, #f8f2e5, #f8f2e5)' }}>
          <div className="w-full max-w-sm text-center animate-scaleIn">

            {/* Icône */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                 style={{ background: 'rgba(181,134,60,0.12)', border: '1px solid rgba(181,134,60,0.3)' }}>
              <span className="text-2xl">⚠️</span>
            </div>

            {/* Message utilisateur — jamais de détail technique */}
            <h2 className="text-lg font-extrabold text-pw-ink mb-2">
              Oups, quelque chose s'est mal passé
            </h2>
            <p className="text-sm text-pw-ink leading-relaxed mb-6">
              Une erreur inattendue s'est produite. Tes données sont préservées.
              Essaie de recharger l'application.
            </p>

            {/* Référence support discrète */}
            <p className="text-[10px] text-pw-ink-soft/25 mb-6 font-mono">
              Réf. : {this.state.errorId}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-full font-extrabold text-sm tap-scale"
                style={{ background: '#211C16', color: '#f8f2e5', boxShadow: 'inset 0 -2.5px 0 #B5863C' }}>
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-full text-sm font-bold"
                style={{ background: 'rgba(33,28,22,0.07)', border: '1px solid rgba(33,28,22,0.12)', color: '#211C16' }}>
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
