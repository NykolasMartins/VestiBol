/**
 * VestiBoL — Cup Page
 * Copa do Conhecimento — até 5 jogos
 * Fase de Grupos → Oitavas → Quartas → Semifinal → Final
 */
import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { CupMatch } from '@/lib/gameStore';
import Layout from '@/components/Layout';
import fundo from '../assets/fundo-resultado2.jpg'


const COPA_BG =  fundo;

export default function Cup() {
  const { state, teamRepresentatives, teamRating, nextMatch, cupWon, cupLostAt, playNextMatch, goToTeamSelection, resetGame } = useGame();
  const [simulating, setSimulating] = useState(false);
  const [lastResult, setLastResult] = useState<{ userScore: number; opponentScore: number; won: boolean | null } | null>(null);

  const playedMatches = state.cupMatches.filter(m => m.played);
  const totalWins = playedMatches.filter(m => m.won === true).length;

  const handlePlayMatch = async () => {
    if (!nextMatch || simulating) return;
    setSimulating(true);
    setLastResult(null);

    // Simula delay dramático
    await new Promise(r => setTimeout(r, 1500));

    playNextMatch();
    setSimulating(false);
  };

  // Pega o último jogo jogado para mostrar resultado
  const lastPlayed = [...state.cupMatches].reverse().find(m => m.played);

  if (state.phase === 'cup-result') {
    return <CupResult />;
  }

  return (
    <Layout>
      <div style={{ backgroundColor: '#f8f9ff', minHeight: 'calc(100vh - 120px)', padding: '2rem 0' }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#1b2e5f',
              letterSpacing: '0.03em',
              marginBottom: '0.25rem',
            }}>
              COPA DO CONHECIMENTO
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Derrote todos os adversários para se tornar Campeão do Conhecimento!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="responsive-grid">
            <style>{`.responsive-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }`}</style>

            {/* Left: Bracket */}
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.25rem', color: '#1b2e5f', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                CHAVEAMENTO
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {state.cupMatches.map((match, i) => (
                  <MatchCard
                    key={match.round}
                    match={match}
                    index={i}
                    isNext={nextMatch?.round === match.round}
                    teamRating={teamRating}
                  />
                ))}
              </div>
            </div>

            {/* Right: Next match + team */}
            <div>
              {/* My team */}
              <div style={{
                backgroundColor: '#1b2e5f',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  MEU TIME
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {teamRepresentatives.map(slot => (
                    <div key={slot.subject} style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ fontSize: '1.25rem' }}>{slot.representative!.emoji}</span>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>{slot.representative!.name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{slot.subject}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.75rem', color: '#c9a227', lineHeight: 1 }}>{teamRating}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Rating</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.75rem', color: '#22c55e', lineHeight: 1 }}>{totalWins}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Vitórias</div>
                  </div>
                </div>
              </div>

              {/* Next match */}
              {nextMatch && (
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '1rem',
                  border: '2px solid #c9a227',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(201,162,39,0.2)',
                }}>
                  <div style={{ backgroundColor: '#c9a227', padding: '0.75rem 1.25rem' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: '#1b2e5f', letterSpacing: '0.08em' }}>
                      PRÓXIMA PARTIDA — {nextMatch.round.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    {/* VS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🛡️</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1b2e5f' }}>Seu Time</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rating: {teamRating}</div>
                      </div>
                      <div style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '1.5rem',
                        color: '#94a3b8',
                        padding: '0 0.5rem',
                      }}>
                        VS
                      </div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{nextMatch.opponent.emoji}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1b2e5f' }}>{nextMatch.opponent.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rating: {nextMatch.opponent.rating}</div>
                      </div>
                    </div>

                    {/* Opponent players */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                        Adversários
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {nextMatch.opponent.players.map(p => (
                          <span key={p.name} style={{
                            backgroundColor: '#f1f5f9',
                            borderRadius: '999px',
                            padding: '0.2rem 0.6rem',
                            fontSize: '0.75rem',
                            color: '#475569',
                          }}>
                            {p.emoji} {p.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty indicator */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                        <span>Dificuldade</span>
                        <span>{nextMatch.opponent.rating}/100</span>
                      </div>
                      <div style={{ backgroundColor: '#e2e8f0', borderRadius: '999px', height: '6px' }}>
                        <div style={{
                          backgroundColor: nextMatch.opponent.rating > teamRating ? '#ef4444' : '#22c55e',
                          height: '6px',
                          borderRadius: '999px',
                          width: `${nextMatch.opponent.rating}%`,
                          transition: 'width 0.5s',
                        }} />
                      </div>
                    </div>

                    <button
                      onClick={handlePlayMatch}
                      disabled={simulating}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        backgroundColor: simulating ? '#94a3b8' : '#1b2e5f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: simulating ? 'not-allowed' : 'pointer',
                        transition: 'all 160ms',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                      onMouseEnter={e => { if (!simulating) e.currentTarget.style.backgroundColor = '#243d7a'; }}
                      onMouseLeave={e => { if (!simulating) e.currentTarget.style.backgroundColor = '#1b2e5f'; }}
                    >
                      {simulating ? (
                        <>
                          <span style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid #fff',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }} />
                          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                          Simulando partida...
                        </>
                      ) : (
                        <>⚽ Jogar Partida</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Last result */}
              {lastPlayed && (
                <div style={{
                  marginTop: '1rem',
                  backgroundColor: lastPlayed.won === true ? '#dcfce7' : lastPlayed.won === false ? '#fee2e2' : '#fef9e7',
                  border: `1px solid ${lastPlayed.won === true ? '#86efac' : lastPlayed.won === false ? '#fca5a5' : '#fcd34d'}`,
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                    {lastPlayed.won === true ? '🎉' : lastPlayed.won === false ? '😔' : '🤝'}
                  </div>
                  <div style={{ fontWeight: 700, color: lastPlayed.won === true ? '#15803d' : lastPlayed.won === false ? '#dc2626' : '#92400e' }}>
                    {lastPlayed.won === true ? 'Vitória!' : lastPlayed.won === false ? 'Derrota' : 'Empate'}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontFamily: "'Bebas Neue', sans-serif", color: '#1b2e5f', marginTop: '0.25rem' }}>
                    {lastPlayed.userScore} × {lastPlayed.opponentScore}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    vs {lastPlayed.opponent.name} — {lastPlayed.round}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function MatchCard({ match, index, isNext, teamRating }: { match: CupMatch; index: number; isNext: boolean; teamRating: number }) {
  const roundIcons: Record<string, string> = {
    'Fase de Grupos': '🏟️',
    'Oitavas': '⚔️',
    'Quartas': '🔥',
    'Semifinal': '⭐',
    'Final': '🏆',
  };

  return (
    <div
      className="slide-up"
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        border: isNext ? '2px solid #c9a227' : match.played ? '1px solid #e2e8f0' : '1px dashed #cbd5e1',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        opacity: !match.played && !isNext ? 0.6 : 1,
        transition: 'all 200ms',
        animationDelay: `${index * 80}ms`,
        boxShadow: isNext ? '0 4px 12px rgba(201,162,39,0.2)' : 'none',
      }}
    >
      {/* Round icon */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: match.played ? (match.won === true ? '#dcfce7' : match.won === false ? '#fee2e2' : '#fef9e7') : isNext ? '#fef9e7' : '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        flexShrink: 0,
      }}>
        {roundIcons[match.round]}
      </div>

      {/* Match info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1b2e5f' }}>{match.round}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          vs {match.opponent.name} {match.opponent.emoji}
        </div>
      </div>

      {/* Result or status */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {match.played ? (
          <>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.1rem',
              color: match.won === true ? '#22c55e' : match.won === false ? '#ef4444' : '#f59e0b',
            }}>
              {match.userScore} × {match.opponentScore}
            </div>
            <div style={{ fontSize: '0.7rem', color: match.won === true ? '#16a34a' : match.won === false ? '#dc2626' : '#d97706', fontWeight: 600 }}>
              {match.won === true ? 'VITÓRIA' : match.won === false ? 'DERROTA' : 'EMPATE'}
            </div>
          </>
        ) : isNext ? (
          <span style={{
            backgroundColor: '#c9a227',
            color: '#1b2e5f',
            borderRadius: '999px',
            padding: '0.2rem 0.6rem',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>
            PRÓXIMO
          </span>
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Aguardando</span>
        )}
      </div>
    </div>
  );
}

function CupResult() {
  const { state, cupWon, cupLostAt, teamRepresentatives, teamRating, accuracy, resetGame, goToTeamSelection } = useGame();

  const wins = state.cupMatches.filter(m => m.won === true).length;
  const totalPlayed = state.cupMatches.filter(m => m.played).length;

  return (
    <Layout>
      <div style={{
        minHeight: 'calc(100vh - 120px)',
        backgroundImage: `url(${COPA_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(27,46,95,0.85)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', width: '100%' }} className="slide-up">
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            {/* Header */}
            <div style={{
              backgroundColor: cupWon ? '#c9a227' : '#1b2e5f',
              padding: '2.5rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>
                {cupWon ? '🏆' : '⚽'}
              </div>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: cupWon ? '#1b2e5f' : '#fff',
                letterSpacing: '0.03em',
                marginBottom: '0.5rem',
              }}>
                {cupWon ? 'CAMPEÃO DO CONHECIMENTO!' : `ELIMINADO NA ${cupLostAt?.round.toUpperCase()}`}
              </h1>
              <p style={{ color: cupWon ? 'rgba(27,46,95,0.8)' : 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>
                {cupWon
                  ? 'Seu conhecimento conquistou o troféu máximo!'
                  : 'Boa tentativa! Continue estudando e tente novamente.'}
              </p>
            </div>

            {/* Stats */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#22c55e', lineHeight: 1 }}>{wins}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Vitórias</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#1b2e5f', lineHeight: 1 }}>{totalPlayed}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Jogos</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#c9a227', lineHeight: 1 }}>{accuracy}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Acertos ENEM</div>
                </div>
              </div>
            </div>

            {/* Match results */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Resultados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {state.cupMatches.filter(m => m.played).map(match => (
                  <div key={match.round} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: match.won === true ? '#dcfce7' : match.won === false ? '#fee2e2' : '#fef9e7',
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1b2e5f' }}>{match.round}</span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>vs {match.opponent.name}</span>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '1rem',
                      color: match.won === true ? '#16a34a' : match.won === false ? '#dc2626' : '#d97706',
                    }}>
                      {match.userScore} × {match.opponentScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Seu Time
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {teamRepresentatives.map(slot => (
                  <span key={slot.subject} style={{
                    backgroundColor: '#f0f4ff',
                    borderRadius: '999px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    color: '#1b2e5f',
                    fontWeight: 600,
                  }}>
                    {slot.representative!.emoji} {slot.representative!.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (confirm('Jogar novamente? Todo o progresso será resetado.')) {
                    resetGame();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#1b2e5f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                  minWidth: '140px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#243d7a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1b2e5f'}
              >
                🔄 Jogar Novamente
              </button>
              <button
                onClick={goToTeamSelection}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#c9a227',
                  color: '#1b2e5f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                  minWidth: '140px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4ae30'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c9a227'}
              >
                📚 Melhorar Time
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
