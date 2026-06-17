/**
 * VestiBoL — Subject Selection Page
 * Seleção de matéria para o quiz
 * Design: Academia Olímpica
 */
import { useGame } from '@/hooks/useGame';
import { Subject, REPRESENTATIVES } from '@/lib/gameStore';
import Layout from '@/components/Layout';

const CARD_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663768624586/ZsCbDQJhC2ByYCVoUB6erj/vestibol-card-bg-4NkmBrLeWbFzPwCsrSyfMY.webp';

interface SubjectInfo {
  name: Subject;
  emoji: string;
  area: string;
  areaColor: string;
  description: string;
}

const SUBJECTS: SubjectInfo[] = [
  { name: 'Matemática', emoji: '📐', area: 'Matemática', areaColor: '#1b2e5f', description: 'Álgebra, geometria, funções e mais' },
  { name: 'Física', emoji: '⚡', area: 'Ciências da Natureza', areaColor: '#2d6a4f', description: 'Mecânica, termodinâmica, eletricidade' },
  { name: 'Química', emoji: '⚗️', area: 'Ciências da Natureza', areaColor: '#2d6a4f', description: 'Reações, tabela periódica, orgânica' },
  { name: 'Biologia', emoji: '🦋', area: 'Ciências da Natureza', areaColor: '#2d6a4f', description: 'Genética, ecologia, evolução' },
  { name: 'História', emoji: '⚔️', area: 'Ciências Humanas', areaColor: '#7c3d12', description: 'Brasil, mundo, revoluções' },
  { name: 'Geografia', emoji: '🌍', area: 'Ciências Humanas', areaColor: '#7c3d12', description: 'Geopolítica, clima, urbanização' },
  { name: 'Literatura', emoji: '📖', area: 'Linguagens', areaColor: '#5b21b6', description: 'Movimentos literários, autores, obras' },
  { name: 'Redação', emoji: '✍️', area: 'Linguagens', areaColor: '#5b21b6', description: 'Argumentação, coesão, coerência' },
  { name: 'Inglês', emoji: '🎭', area: 'Linguagens', areaColor: '#5b21b6', description: 'Leitura, interpretação, vocabulário' },
];

export default function SubjectSelection() {
  const { state, isSubjectCompleted, startQuiz, goToTeamView, isTeamReady, teamRepresentatives, startCup } = useGame();

  const completedCount = state.teamSlots.filter(s => s.completed).length;
  const representativeCount = teamRepresentatives.length;

  return (
    <Layout>
      <div style={{ backgroundColor: '#f8f9ff', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1b2e5f',
                  letterSpacing: '0.03em',
                  marginBottom: '0.25rem',
                }}>
                  ESCOLHA UMA MATÉRIA
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  Responda 3 questões do ENEM para ganhar um representante histórico
                </p>
              </div>

              {/* Progress indicator */}
              <div style={{
                backgroundColor: '#1b2e5f',
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                textAlign: 'center',
                minWidth: '160px',
              }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2rem',
                  color: '#c9a227',
                  lineHeight: 1,
                }}>
                  {representativeCount}/5
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Representantes no Time
                </div>
                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: i < representativeCount ? '#c9a227' : 'rgba(255,255,255,0.2)',
                      transition: 'background-color 300ms',
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Info banner */}
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #c9a227',
              borderRadius: '0.5rem',
              padding: '0.875rem 1.25rem',
              marginTop: '1.25rem',
              fontSize: '0.875rem',
              color: '#475569',
            }}>
              <strong style={{ color: '#1b2e5f' }}>Como funciona:</strong> Você tem 9 matérias disponíveis e precisa de 5 representantes.
              Acertos determinam a qualidade do representante. Pode tentar quantas matérias quiser!
            </div>
          </div>

          {/* Subject grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }} className="stagger">
            {SUBJECTS.map((subj) => {
              const completed = isSubjectCompleted(subj.name);
              const slot = state.teamSlots.find(s => s.subject === subj.name);
              const reps = REPRESENTATIVES[subj.name];

              return (
                <SubjectCard
                  key={subj.name}
                  subject={subj}
                  completed={completed}
                  slot={slot}
                  representatives={reps}
                  onSelect={() => startQuiz(subj.name)}
                />
              );
            })}
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {representativeCount > 0 && (
              <button
                onClick={goToTeamView}
                style={{
                  backgroundColor: '#fff',
                  color: '#1b2e5f',
                  border: '2px solid #1b2e5f',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.75rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0f4ff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                👥 Ver Meu Time ({representativeCount}/5)
              </button>
            )}

            {isTeamReady && (
              <button
                onClick={startCup}
                style={{
                  backgroundColor: '#c9a227',
                  color: '#1b2e5f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.75rem',
                  fontWeight: 700,
                  fontSize: '1rem',
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
          </div>

          {isTeamReady && (
            <p style={{ textAlign: 'center', color: '#2d6a4f', fontWeight: 600, marginTop: '1rem', fontSize: '0.9rem' }}>
              ✅ Time completo! Você pode disputar a Copa do Conhecimento agora.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}

interface SubjectCardProps {
  subject: SubjectInfo;
  completed: boolean;
  slot: any;
  representatives: any[];
  onSelect: () => void;
}

function SubjectCard({ subject, completed, slot, representatives, onSelect }: SubjectCardProps) {
  const hasRep = completed && slot?.representative !== null;
  const noRep = completed && slot?.representative === null;

  return (
    <div
      className="slide-up"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: hasRep ? '2px solid #c9a227' : noRep ? '2px solid #ef4444' : '1px solid #e2e8f0',
        boxShadow: hasRep ? '0 0 0 1px #c9a227, 0 8px 24px rgba(201,162,39,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative',
      }}
    >
      {/* Card header */}
      <div style={{
        backgroundColor: subject.areaColor,
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.75rem' }}>{subject.emoji}</span>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', color: '#fff', letterSpacing: '0.03em' }}>
            {subject.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {subject.area}
          </div>
        </div>
        {completed && (
          <div style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>
            {hasRep ? '✅' : '❌'}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1.25rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {subject.description}
        </p>

        {/* Representatives preview */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Representantes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {representatives.map((rep, i) => (
              <div key={rep.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>{rep.emoji}</span>
                <span style={{ fontSize: '0.8rem', color: '#475569', flex: 1 }}>{rep.name}</span>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: i === 0 ? '#fef3c7' : i === 1 ? '#f0f4ff' : '#f8fafc',
                  color: i === 0 ? '#92400e' : i === 1 ? '#1b2e5f' : '#64748b',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}>
                  {i === 0 ? '3 acertos' : i === 1 ? '2 acertos' : '1 acerto'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Result if completed */}
        {completed && slot && (
          <div style={{
            backgroundColor: hasRep ? '#fef9e7' : '#fef2f2',
            border: `1px solid ${hasRep ? '#c9a227' : '#fca5a5'}`,
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            {hasRep ? (
              <>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{slot.representative.emoji}</div>
                <div style={{ fontWeight: 700, color: '#1b2e5f', fontSize: '0.9rem' }}>{slot.representative.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#92400e' }}>{slot.correctAnswers}/3 acertos</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>😔</div>
                <div style={{ fontWeight: 600, color: '#dc2626', fontSize: '0.85rem' }}>Sem representante (0 acertos)</div>
              </>
            )}
          </div>
        )}

        {/* Action button */}
        <button
          onClick={onSelect}
          style={{
            width: '100%',
            backgroundColor: completed ? (hasRep ? '#1b2e5f' : '#475569') : '#1b2e5f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.625rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 160ms',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#243d7a'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = completed ? (hasRep ? '#1b2e5f' : '#475569') : '#1b2e5f'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {completed ? '🔄 Tentar Novamente' : '▶ Responder Questões'}
        </button>
      </div>
    </div>
  );
}
