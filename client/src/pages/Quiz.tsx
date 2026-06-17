/**
 * VestiBoL — Quiz Page
 * 3 questões do ENEM por matéria
 * Integração com api.enem.dev
 */
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import { useEnemQuestions, EnemQuestion } from '@/hooks/useEnemQuestions';
import { REPRESENTATIVES, Subject } from '@/lib/gameStore';
import Layout from '@/components/Layout';

// Componente para renderizar contexto com imagens
function ContextRenderer({ context }: { context: string }) {
  // Extrai imagens do markdown: ![alt](url)
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const parts: (string | { type: 'image'; url: string; alt: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = imageRegex.exec(context)) !== null) {
    // Adiciona texto antes da imagem
    if (match.index > lastIndex) {
      parts.push(context.substring(lastIndex, match.index));
    }
    // Adiciona a imagem
    parts.push({
      type: 'image',
      url: match[2],
      alt: match[1],
    });
    lastIndex = match.index + match[0].length;
  }

  // Adiciona texto restante
  if (lastIndex < context.length) {
    parts.push(context.substring(lastIndex));
  }

  return (
    <div>
      {parts.map((part, i) => {
        if (typeof part === 'string') {
          return (
            <p key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '1rem' }}>
              {part.replace(/\*\*/g, '')}
            </p>
          );
        } else {
          return (
            <div key={i} style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <img
                src={part.url}
                alt={part.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
}

export default function Quiz() {
  const { state, completeQuiz, goToTeamSelection } = useGame();
  const subject = state.currentQuizSubject as Subject;
  const { questions, loading, error, fetchQuestions } = useEnemQuestions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [answerClass, setAnswerClass] = useState('');

  useEffect(() => {
    if (subject) {
      fetchQuestions(subject);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setCorrectAnswers(0);
      setResults([]);
      setShowResult(false);
    }
  }, [subject, fetchQuestions]);

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = useCallback((letter: string) => {
    if (answered) return;
    setSelectedAnswer(letter);
  }, [answered]);

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer || !currentQuestion || answered) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAlternative;
    setAnswered(true);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setAnswerClass('answer-pulse');
    } else {
      setAnswerClass('answer-shake');
    }

    setResults(prev => [...prev, isCorrect]);

    setTimeout(() => setAnswerClass(''), 500);
  }, [selectedAnswer, currentQuestion, answered]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= 3 || nextIndex >= questions.length) {
      // Usa o valor atualizado de correctAnswers baseado em results
      setShowResult(true);
    } else {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setAnswered(false);
      setAnswerClass('');
    }
  }, [currentIndex, questions.length]);

  const handleFinish = useCallback(() => {
    completeQuiz(subject, correctAnswers);
  }, [subject, correctAnswers, completeQuiz]);

  if (!subject) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: '#64748b' }}>Nenhuma matéria selecionada.</p>
          <button onClick={goToTeamSelection} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#1b2e5f', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
            Escolher Matéria
          </button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #1b2e5f',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#1b2e5f' }}>CARREGANDO QUESTÕES</p>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Buscando questões de {subject} no ENEM...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (showResult) {
    return <QuizResult subject={subject} correctAnswers={correctAnswers} results={results} onFinish={handleFinish} />;
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.75rem', color: '#1b2e5f', marginBottom: '0.5rem' }}>
            QUESTÕES NÃO DISPONÍVEIS
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {error || 'Não foi possível carregar questões para esta matéria no momento.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => fetchQuestions(subject)}
              style={{ padding: '0.625rem 1.5rem', backgroundColor: '#1b2e5f', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Tentar Novamente
            </button>
            <button
              onClick={goToTeamSelection}
              style={{ padding: '0.625rem 1.5rem', backgroundColor: '#fff', color: '#1b2e5f', border: '2px solid #1b2e5f', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Escolher Outra Matéria
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const questionNum = Math.min(currentIndex + 1, 3);
  const isCorrect = answered && selectedAnswer === currentQuestion.correctAlternative;
  const isWrong = answered && selectedAnswer !== currentQuestion.correctAlternative;

  return (
    <Layout>
      <div style={{ backgroundColor: '#f8f9ff', minHeight: 'calc(100vh - 120px)', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Progress header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{
                  backgroundColor: '#1b2e5f',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {subject}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: i < results.length ? (results[i] ? '#22c55e' : '#ef4444') : i === currentIndex ? '#1b2e5f' : '#e2e8f0',
                    backgroundColor: i < results.length ? (results[i] ? '#dcfce7' : '#fee2e2') : i === currentIndex ? '#f0f4ff' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: i < results.length ? (results[i] ? '#16a34a' : '#dc2626') : i === currentIndex ? '#1b2e5f' : '#94a3b8',
                    transition: 'all 300ms',
                  }}>
                    {i < results.length ? (results[i] ? '✓' : '✗') : i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ backgroundColor: '#e2e8f0', borderRadius: '999px', height: '6px' }}>
              <div style={{
                backgroundColor: '#1b2e5f',
                height: '6px',
                borderRadius: '999px',
                width: `${(questionNum / 3) * 100}%`,
                transition: 'width 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Questão {questionNum} de 3</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ENEM {currentQuestion.year}</span>
            </div>
          </div>

          {/* Question card */}
          <div
            className={`slide-up ${answerClass}`}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              marginBottom: '1.25rem',
            }}
          >
            {/* Question header */}
            <div style={{ backgroundColor: '#1b2e5f', padding: '1.25rem 1.5rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                QUESTÃO {questionNum} — ENEM {currentQuestion.year}
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Context */}
              {currentQuestion.context && (
                <div style={{
                  backgroundColor: '#f8f9ff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.9rem',
                  color: '#374151',
                  lineHeight: 1.7,
                  
                  
                }}>
                  <div style={{ fontWeight: 600, color: '#1b2e5f', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    TEXTO BASE
                  </div>
                  <ContextRenderer context={currentQuestion.context} />
                </div>
              )}

              {/* Question text */}
              {currentQuestion.alternativesIntroduction && (
                <div style={{
                  fontSize: '1rem',
                  color: '#1e293b',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                  fontWeight: 500,
                }}>
                  {currentQuestion.alternativesIntroduction}
                </div>
              )}

              {/* Alternatives */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {currentQuestion.alternatives.map((alt) => {
                  const isSelected = selectedAnswer === alt.letter;
                  const isCorrectAlt = alt.isCorrect;
                  const showCorrect = answered && isCorrectAlt;
                  const showWrong = answered && isSelected && !isCorrectAlt;

                  return (
                    <button
                      key={alt.letter}
                      onClick={() => handleSelectAnswer(alt.letter)}
                      disabled={answered}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.5rem',
                        border: '2px solid',
                        borderColor: showCorrect ? '#22c55e' : showWrong ? '#ef4444' : isSelected ? '#1b2e5f' : '#e2e8f0',
                        backgroundColor: showCorrect ? '#dcfce7' : showWrong ? '#fee2e2' : isSelected ? '#f0f4ff' : '#fff',
                        cursor: answered ? 'default' : 'pointer',
                        transition: 'all 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                      onMouseEnter={e => {
                        if (!answered) e.currentTarget.style.borderColor = '#1b2e5f';
                      }}
                      onMouseLeave={e => {
                        if (!answered && !isSelected) e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <span style={{
                        minWidth: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: showCorrect ? '#22c55e' : showWrong ? '#ef4444' : isSelected ? '#1b2e5f' : '#f1f5f9',
                        color: showCorrect || showWrong || isSelected ? '#fff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        flexShrink: 0,
                        transition: 'all 160ms',
                      }}>
                        {showCorrect ? '✓' : showWrong ? '✗' : alt.letter}
                      </span>
                      <span style={{
                        fontSize: '0.9rem',
                        color: showCorrect ? '#15803d' : showWrong ? '#dc2626' : '#374151',
                        lineHeight: 1.5,
                        fontWeight: isSelected ? 600 : 400,
                      }}>
                        {alt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {answered && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                  border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{isCorrect ? '🎉' : '😔'}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: isCorrect ? '#15803d' : '#dc2626', fontSize: '0.95rem' }}>
                      {isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
                    </div>
                    {!isCorrect && (
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                        A resposta correta era: <strong>{currentQuestion.correctAlternative}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={goToTeamSelection}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: '#fff',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ← Voltar
            </button>

            {!answered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                style={{
                  padding: '0.625rem 1.75rem',
                  backgroundColor: selectedAnswer ? '#1b2e5f' : '#94a3b8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                  transition: 'all 160ms',
                }}
                onMouseEnter={e => { if (selectedAnswer) e.currentTarget.style.backgroundColor = '#243d7a'; }}
                onMouseLeave={e => { if (selectedAnswer) e.currentTarget.style.backgroundColor = '#1b2e5f'; }}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                style={{
                  padding: '0.625rem 1.75rem',
                  backgroundColor: '#c9a227',
                  color: '#1b2e5f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4ae30'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c9a227'}
              >
                {currentIndex + 1 >= 3 ? 'Ver Resultado →' : 'Próxima Questão →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Componente de resultado do quiz
function QuizResult({ subject, correctAnswers, results, onFinish }: {
  subject: Subject;
  correctAnswers: number;
  results: boolean[];
  onFinish: () => void;
}) {
  const reps = REPRESENTATIVES[subject];
  let representative = null;
  if (correctAnswers >= 3) representative = reps[0];
  else if (correctAnswers === 2) representative = reps[1];
  else if (correctAnswers === 1) representative = reps[2];

  const messages = [
    { min: 3, title: 'PERFEITO!', subtitle: 'Você acertou tudo!', color: '#c9a227', bg: '#fef9e7' },
    { min: 2, title: 'MUITO BOM!', subtitle: 'Quase lá!', color: '#22c55e', bg: '#dcfce7' },
    { min: 1, title: 'PODE MELHORAR', subtitle: 'Continue estudando!', color: '#f59e0b', bg: '#fef3c7' },
    { min: 0, title: 'TENTE NOVAMENTE', subtitle: 'Não desista!', color: '#ef4444', bg: '#fee2e2' },
  ];

  const msg = messages.find(m => correctAnswers >= m.min) ?? messages[3];

  return (
    <Layout>
      <div style={{ backgroundColor: '#f8f9ff', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '500px', width: '100%' }} className="slide-up">
          {/* Score card */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: representative ? '2px solid #c9a227' : '1px solid #e2e8f0',
          }}>
            {/* Header */}
            <div style={{ backgroundColor: '#1b2e5f', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                RESULTADO — {subject.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: '#c9a227', lineHeight: 1 }}>
                {correctAnswers}/3
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {msg.title}
              </div>
            </div>

            {/* Results dots */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {results.map((correct, i) => (
                  <div key={i} style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: correct ? '#dcfce7' : '#fee2e2',
                    border: `2px solid ${correct ? '#22c55e' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}>
                    {correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>

            {/* Representative */}
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              {representative ? (
                <>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    SEU REPRESENTANTE
                  </div>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{representative.emoji}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#1b2e5f', letterSpacing: '0.03em' }}>
                    {representative.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {representative.description}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#fef9e7',
                    border: '1px solid #c9a227',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#92400e',
                    marginTop: '0.75rem',
                  }}>
                    ⭐ Força: {representative.rating}/100
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>😔</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.25rem', color: '#dc2626' }}>
                    SEM REPRESENTANTE
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Você precisa de pelo menos 1 acerto para ganhar um representante.
                    Tente outra matéria!
                  </div>
                </>
              )}
            </div>

            {/* Action */}
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8f9ff', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={onFinish}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#c9a227',
                  color: '#1b2e5f',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 160ms',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4ae30'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c9a227'}
              >
                {representative ? '✅ Adicionar ao Time' : '↩ Ver Meu Time'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
