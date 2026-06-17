/**
 * VestiBoL — Team View Page
 * Visualização do time montado com representantes históricos
 */
import { useGame } from '@/hooks/useGame';
import { calculateTeamRating, TeamSlot } from '@/lib/gameStore';
import Layout from '@/components/Layout';

const CARD_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663768624586/ZsCbDQJhC2ByYCVoUB6erj/vestibol-card-bg-4NkmBrLeWbFzPwCsrSyfMY.webp';

export default function TeamView() {
  const {
    state,
    teamRepresentatives,
    isTeamReady,
    teamRating,
    accuracy,
    goToTeamSelection,
    startCup,
    resetGame,
  } = useGame();

  const emptySlots = Math.max(0, 5 - teamRepresentatives.length);

  return (
    <Layout>
      <div style={{ backgroundColor: '#f8f9ff', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 0' }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                color: '#1b2e5f',
                letterSpacing: '0.03em',
                marginBottom: '0.25rem',
              }}>
                MEU TIME
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {teamRepresentatives.length === 0
                  ? 'Nenhum representante ainda. Escolha uma matéria para começar!'
                  : `${teamRepresentatives.length} de 5 representantes escalados`}
              </p>
            </div>

            {/* Team rating */}
            {teamRepresentatives.length > 0 && (
              <div style={{
                backgroundColor: '#1b2e5f',
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#c9a227', lineHeight: 1 }}>
                  {teamRating}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Rating do Time
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {accuracy}% de acertos
                </div>
              </div>
            )}
          </div>

          {/* Team grid */}
          {teamRepresentatives.length === 0 ? (
            <EmptyTeam onSelectSubject={goToTeamSelection} />
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }} className="stagger">
                {teamRepresentatives.map((slot, i) => (
                  <RepresentativeCard key={slot.subject} slot={slot} index={i} />
                ))}

                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <EmptySlot key={`empty-${i}`} index={teamRepresentatives.length + i} onAdd={goToTeamSelection} />
                ))}
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}>
                <StatCard label="Questões Respondidas" value={state.totalAnswered} icon="📝" />
                <StatCard label="Acertos Totais" value={state.totalCorrect} icon="✅" />
                <StatCard label="Taxa de Acerto" value={`${accuracy}%`} icon="🎯" />
                <StatCard label="Matérias Completadas" value={state.teamSlots.filter(s => s.completed).length} icon="📚" />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={goToTeamSelection}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: '#fff',
                color: '#1b2e5f',
                border: '2px solid #1b2e5f',
                borderRadius: '0.5rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 160ms',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              📚 Escolher Matéria
            </button>

            {isTeamReady && (
              <button
                onClick={startCup}
                style={{
                  padding: '0.75rem 1.75rem',
                  backgroundColor: '#c9a227',
                  color: '#1b2e5f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                  boxShadow: '0 4px 16px rgba(201,162,39,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4ae30'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#c9a227'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                🏆 Disputar a Copa!
              </button>
            )}

            {state.teamSlots.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Tem certeza que quer resetar o jogo? Todo progresso será perdido.')) {
                    resetGame();
                  }
                }}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#fff',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
              >
                🗑️ Resetar Jogo
              </button>
            )}
          </div>

          {!isTeamReady && teamRepresentatives.length > 0 && (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginTop: '1rem' }}>
              Você precisa de {5 - teamRepresentatives.length} representante(s) a mais para disputar a copa.
              Você tem 9 matérias disponíveis — escolha as que se sentir mais confiante!
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}

function RepresentativeCard({ slot, index }: { slot: TeamSlot; index: number }) {
  const rep = slot.representative!;
  const ratingColor = rep.rating >= 90 ? '#c9a227' : rep.rating >= 75 ? '#22c55e' : '#64748b';

  return (
    <div
      className="slide-up card-hover"
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 0 0 2px #c9a227, 0 8px 24px rgba(201,162,39,0.2)',
        position: 'relative',
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Card background */}
      <div style={{
        backgroundImage: `url(${CARD_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '1.5rem 1rem',
        textAlign: 'center',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Gold badge */}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          backgroundColor: '#c9a227',
          color: '#1b2e5f',
          borderRadius: '999px',
          padding: '0.15rem 0.5rem',
          fontSize: '0.7rem',
          fontWeight: 700,
        }}>
          #{index + 1}
        </div>

        <div style={{ fontSize: '3rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          {rep.emoji}
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.1rem',
          color: '#ffffff',
          letterSpacing: '0.03em',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          lineHeight: 1.2,
          marginBottom: '0.25rem',
        }}>
          {rep.name}
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.75)',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        }}>
          {slot.subject}
        </div>
      </div>

      {/* Card footer */}
      <div style={{
        backgroundColor: '#1b2e5f',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
          {slot.correctAnswers}/3 acertos
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.1rem',
          color: ratingColor,
        }}>
          ⭐ {rep.rating}
        </div>
      </div>
    </div>
  );
}

function EmptySlot({ index, onAdd }: { index: number; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="slide-up card-hover"
      style={{
        borderRadius: '1rem',
        border: '2px dashed #cbd5e1',
        backgroundColor: '#fff',
        padding: '2rem 1rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 200ms',
        animationDelay: `${index * 80}ms`,
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1b2e5f'; e.currentTarget.style.backgroundColor = '#f0f4ff'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#fff'; }}
    >
      <div style={{ fontSize: '2rem', color: '#cbd5e1' }}>+</div>
      <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.85rem' }}>Vaga #{index + 1}</div>
      <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Escolher matéria</div>
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '0.75rem',
      padding: '1rem',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.75rem', color: '#1b2e5f', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

function EmptyTeam({ onSelectSubject }: { onSelectSubject: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚽</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.75rem', color: '#1b2e5f', marginBottom: '0.5rem' }}>
        TIME VAZIO
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
        Você ainda não tem representantes. Escolha uma matéria, responda 3 questões do ENEM e ganhe seu primeiro ícone histórico!
      </p>
      <button
        onClick={onSelectSubject}
        style={{
          backgroundColor: '#1b2e5f',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.875rem 2rem',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 160ms',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#243d7a'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1b2e5f'}
      >
        📚 Escolher Primeira Matéria
      </button>
    </div>
  );
}
