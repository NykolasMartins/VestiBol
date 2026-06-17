/**
 * VestiBoL — Home Page
 * Landing page com hero épico e CTA para começar o jogo
 * Design: Academia Olímpica — Azul Real + Dourado
 */
import { useGame } from '@/hooks/useGame';
import logo from '../assets/logo-vestibol.png'
import fundo from '../assets/fundo-resultado.jpg'


const HERO_URL = fundo;
const LOGO_URL = logo;

const STEPS = [
  {
    num: '01',
    icon: '📚',
    title: 'Escolha uma Matéria',
    desc: 'Selecione entre 9 matérias do ENEM: Matemática, Física, Química, Biologia, História, Geografia, Literatura, Redação ou Inglês.',
  },
  {
    num: '02',
    icon: '❓',
    title: 'Responda 3 Questões',
    desc: 'Questões reais do ENEM via api.enem.dev. Cada acerto conta para determinar qual ícone histórico representará a matéria.',
  },
  {
    num: '03',
    icon: '🏆',
    title: 'Monte seu Time',
    desc: '3 acertos = melhor representante. 2 acertos = bom. 1 acerto = básico. 0 acertos = sem representante. Forme um time de 5!',
  },
  {
    num: '04',
    icon: '⚽',
    title: 'Dispute a Copa',
    desc: 'Com 5 representantes, enfrente times históricos em até 5 partidas: Fase de Grupos, Oitavas, Quartas, Semifinal e Final!',
  },
];

const SUBJECTS_PREVIEW = [
  { name: 'Matemática', emoji: '📐', color: '#1b2e5f' },
  { name: 'Física', emoji: '⚡', color: '#243d7a' },
  { name: 'Química', emoji: '⚗️', color: '#1b2e5f' },
  { name: 'Biologia', emoji: '🦋', color: '#2d6a4f' },
  { name: 'História', emoji: '⚔️', color: '#1b2e5f' },
  { name: 'Geografia', emoji: '🌍', color: '#243d7a' },
  { name: 'Literatura', emoji: '📖', color: '#1b2e5f' },
  { name: 'Redação', emoji: '✍️', color: '#2d6a4f' },
  { name: 'Inglês', emoji: '🎭', color: '#1b2e5f' },
];

export default function Home() {
  const { state, goToTeamSelection } = useGame();
  const hasProgress = state.teamSlots.length > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navbar simples para home */}
      <nav style={{ backgroundColor: '#1b2e5f', borderBottom: '3px solid #c9a227', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={LOGO_URL} alt="VestiBoL" style={{ height: '44px', objectFit: 'contain' }} />
          </div>
          <button
            onClick={goToTeamSelection}
            style={{
              backgroundColor: '#c9a227',
              color: '#1b2e5f',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 160ms',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4ae30'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c9a227'}
          >
            {hasProgress ? 'Continuar Jogo' : 'Jogar Agora'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${HERO_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.6)',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(27,46,95,0.95) 40%, rgba(27,46,95,0.4) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '600px' }} className="slide-up">
            <div style={{
              display: 'inline-block',
              backgroundColor: '#c9a227',
              color: '#1b2e5f',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              ⚽ Questões Reais do ENEM
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              color: '#ffffff',
              lineHeight: 0.95,
              marginBottom: '1.25rem',
              letterSpacing: '0.02em',
            }}>
              SEU CONHECIMENTO<br />
              <span style={{ color: '#c9a227' }}>EM CAMPO</span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '480px',
            }}>
              Monte um time de ícones históricos respondendo questões do ENEM.
              Pitágoras, Darwin, Newton e mais — quem entra em campo depende de você.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={goToTeamSelection}
                style={{
                  backgroundColor: '#c9a227',
                  color: '#1b2e5f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.875rem 2rem',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                  boxShadow: '0 4px 20px rgba(201,162,39,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4ae30'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#c9a227'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              >
                {hasProgress ? '▶ Continuar Jogo' : '⚽ Começar Agora'}
              </button>

              <a
                href="#como-funciona"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              >
                Como Funciona
              </a>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Matérias', value: '9' },
                { label: 'Ícones Históricos', value: '27' },
                { label: 'Jogos na Copa', value: '5' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#c9a227', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" style={{ backgroundColor: '#f8f9ff', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#1b2e5f',
              letterSpacing: '0.03em',
              marginBottom: '0.75rem',
            }}>
              COMO FUNCIONA
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              Quatro passos para montar seu time dos sonhos e conquistar a copa
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }} className="stagger">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="slide-up card-hover"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '3.5rem',
                  color: '#f0f4ff',
                  lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{step.icon}</div>
                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '1.3rem',
                  color: '#1b2e5f',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.03em',
                }}>
                  {step.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matérias */}
      <section style={{ backgroundColor: '#1b2e5f', padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '0.75rem',
            letterSpacing: '0.03em',
          }}>
            9 MATÉRIAS, 27 ÍCONES
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginBottom: '3rem', fontSize: '1.05rem' }}>
            Cada matéria tem 3 representantes históricos. Quem entra depende do seu desempenho.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }} className="stagger">
            {SUBJECTS_PREVIEW.map((subj) => (
              <button
                key={subj.name}
                onClick={goToTeamSelection}
                className="slide-up card-hover"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(201,162,39,0.3)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem 0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  color: '#fff',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(201,162,39,0.15)';
                  e.currentTarget.style.borderColor = '#c9a227';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201,162,39,0.3)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{subj.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{subj.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#fff', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#1b2e5f',
              marginBottom: '1rem',
              letterSpacing: '0.03em',
            }}>
              PRONTO PARA ENTRAR EM CAMPO?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Responda questões reais do ENEM, monte seu time de gênios históricos e dispute a Copa do Conhecimento.
            </p>
            <button
              onClick={goToTeamSelection}
              style={{
                backgroundColor: '#1b2e5f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '1rem 2.5rem',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: '0 4px 20px rgba(27,46,95,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#243d7a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1b2e5f'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              ⚽ Começar Agora — É Grátis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1b2e5f', borderTop: '3px solid #c9a227', padding: '1.5rem 0', textAlign: 'center' }}>
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
