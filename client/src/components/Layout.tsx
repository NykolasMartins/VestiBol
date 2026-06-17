/**
 * VestiBoL — Layout Component
 * Navbar com logo e navegação principal
 * Design: Academia Olímpica — Azul Real + Branco
 */
import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import logo from '../assets/logo-vestibol.png'
const LOGO_URL = logo;



interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = true }: LayoutProps) {
  const { state, teamRepresentatives, isTeamReady, goToHome, goToTeamView, goToTeamSelection } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);

  const isInGame = state.phase !== 'home';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNav && (
        <nav
          style={{
            backgroundColor: '#1b2e5f',
            borderBottom: '3px solid #c9a227',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
              {/* Logo */}
              <button
                onClick={goToHome}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <img
                  src={LOGO_URL}
                  alt="VestiBoL Logo"
                  style={{ height: '38px', objectFit: 'contain' }}
                />
                
              </button>

              {/* Desktop Nav */}
              {isInGame && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hidden md:flex">
                  <NavButton onClick={goToTeamSelection} label="Escolher Matéria" />
                  <NavButton onClick={goToTeamView} label={`Meu Time (${teamRepresentatives.length}/5)`} highlight={isTeamReady} />
                </div>
              )}

              {/* Team indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isInGame && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: i < teamRepresentatives.length ? '#c9a227' : 'rgba(255,255,255,0.25)',
                          transition: 'background-color 300ms',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Mobile menu button */}
                {isInGame && (
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '0.25rem',
                    }}
                    className="md:hidden"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {menuOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                      ) : (
                        <>
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <line x1="3" y1="12" x2="21" y2="12" />
                          <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                      )}
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && isInGame && (
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
                className="md:hidden"
              >
                <MobileNavButton onClick={() => { goToTeamSelection(); setMenuOpen(false); }} label="Escolher Matéria" />
                <MobileNavButton onClick={() => { goToTeamView(); setMenuOpen(false); }} label={`Meu Time (${teamRepresentatives.length}/5)`} />
              </div>
            )}
          </div>
        </nav>
      )}

      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1b2e5f', borderTop: '1px solid rgba(201,162,39,0.3)', padding: '1rem 0', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          VestiBoL © 2026 — Questões reais do ENEM via{' '}
          <a href="https://enem.dev" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a227', textDecoration: 'none' }}>
            api.enem.dev
          </a>
        </p>
      </footer>
    </div>
  );
}

function NavButton({ onClick, label, highlight }: { onClick: () => void; label: string; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: highlight ? '#c9a227' : 'rgba(255,255,255,0.1)',
        color: highlight ? '#1b2e5f' : '#ffffff',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 600,
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 160ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = highlight ? '#d4ae30' : 'rgba(255,255,255,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = highlight ? '#c9a227' : 'rgba(255,255,255,0.1)';
      }}
    >
      {label}
    </button>
  );
}

function MobileNavButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.75rem 1rem',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {label}
    </button>
  );
}
