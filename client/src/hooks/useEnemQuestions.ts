/**
 * VestiBoL — useEnemQuestions Hook
 * Busca questões da API api.enem.dev por disciplina
 * 
 * Estrutura do ENEM 2023 (183 questões total):
 * - linguagens:        offsets 0-45   (índices 1-45, 45 questões)
 * - ciencias-humanas:  offsets 46-90  (índices 46-90, 45 questões)
 * - ciencias-natureza: offsets 91-135 (índices 91-135, 45 questões)
 * - matematica:        offsets 136-183 (índices 136-183, 48 questões)
 */
import { useState, useCallback } from 'react';
import { Discipline, SUBJECT_TO_DISCIPLINE, Subject } from '@/lib/gameStore';

export interface EnemQuestion {
  title: string;
  index: number;
  discipline: string;
  language: string | null;
  year: number;
  context: string | null;
  files: string[];
  correctAlternative: string;
  alternativesIntroduction: string | null;
  alternatives: {
    letter: string;
    text: string | null;
    file: string | null;
    isCorrect: boolean;
  }[];
}

const ENEM_API_BASE = 'https://api.enem.dev/v1';
const AVAILABLE_YEARS = [2023, 2022, 2021, 2020, 2019];

// Offsets reais por disciplina no ENEM 2023
// Baseado em análise da API: total 183 questões
const DISCIPLINE_OFFSETS: Record<Discipline, { start: number; end: number }> = {
  'linguagens':        { start: 0,   end: 44  },  // 45 questões
  'ciencias-humanas':  { start: 46,  end: 89  },  // 44 questões
  'ciencias-natureza': { start: 91,  end: 134 },  // 44 questões
  'matematica':        { start: 136, end: 182 },  // 47 questões
};

async function fetchQuestionsForDiscipline(
  discipline: Discipline,
  count: number = 3
): Promise<EnemQuestion[]> {
  const year = AVAILABLE_YEARS[Math.floor(Math.random() * AVAILABLE_YEARS.length)];
  const { start, end } = DISCIPLINE_OFFSETS[discipline];
  const range = end - start;

  // Pega um offset aleatório dentro da faixa da disciplina
  // Garante que há questões suficientes para buscar
  const maxStart = Math.max(start, end - 15);
  const randomStart = start + Math.floor(Math.random() * Math.max(1, range - 15));
  const offset = Math.min(randomStart, maxStart);

  const url = `${ENEM_API_BASE}/exams/${year}/questions?limit=20&offset=${offset}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const questions: EnemQuestion[] = data.questions || [];

  // Filtra questões da disciplina correta e que tenham alternativas com texto
  const filtered = questions.filter(q =>
    q.discipline === discipline &&
    q.alternatives &&
    q.alternatives.length >= 4 &&
    q.alternatives.every(a => a.text && a.text.trim().length > 0) &&
    (q.context || q.alternativesIntroduction)
  );

  // Se não tiver questões suficientes, tenta buscar do início da disciplina
  if (filtered.length < count) {
    const url2 = `${ENEM_API_BASE}/exams/${year}/questions?limit=30&offset=${start}`;
    const res2 = await fetch(url2);
    if (res2.ok) {
      const data2 = await res2.json();
      const more = (data2.questions || []).filter((q: EnemQuestion) =>
        q.discipline === discipline &&
        q.alternatives &&
        q.alternatives.length >= 4 &&
        q.alternatives.every((a: EnemQuestion['alternatives'][0]) => a.text && a.text.trim().length > 0) &&
        (q.context || q.alternativesIntroduction)
      );
      // Adiciona apenas as que não estão já em filtered
      const existingIndexes = new Set(filtered.map(q => q.index));
      for (const q of more) {
        if (!existingIndexes.has(q.index)) {
          filtered.push(q);
        }
      }
    }
  }

  // Embaralha e retorna os primeiros `count`
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function useEnemQuestions() {
  const [questions, setQuestions] = useState<EnemQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (subject: Subject) => {
    setLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const discipline = SUBJECT_TO_DISCIPLINE[subject];
      const fetched = await fetchQuestionsForDiscipline(discipline, 3);

      if (fetched.length === 0) {
        throw new Error('Nenhuma questão encontrada para esta disciplina');
      }

      // Garante exatamente 3 questões (pode ter menos se a API retornar poucas)
      setQuestions(fetched.slice(0, 3));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar questões';
      setError(msg);
      // Fallback: questões de exemplo
      setQuestions(getFallbackQuestions(subject));
    } finally {
      setLoading(false);
    }
  }, []);

  return { questions, loading, error, fetchQuestions };
}

// Questões de fallback caso a API falhe
function getFallbackQuestions(_subject: Subject): EnemQuestion[] {
  return [
    {
      title: 'Questão de Exemplo',
      index: 1,
      discipline: 'matematica',
      language: null,
      year: 2022,
      context: null,
      files: [],
      correctAlternative: 'B',
      alternativesIntroduction: 'Uma progressão aritmética tem primeiro termo a₁ = 3 e razão r = 4. Qual é o 5º termo desta progressão?',
      alternatives: [
        { letter: 'A', text: '15', file: null, isCorrect: false },
        { letter: 'B', text: '19', file: null, isCorrect: true },
        { letter: 'C', text: '23', file: null, isCorrect: false },
        { letter: 'D', text: '27', file: null, isCorrect: false },
        { letter: 'E', text: '31', file: null, isCorrect: false },
      ],
    },
    {
      title: 'Questão de Exemplo',
      index: 2,
      discipline: 'matematica',
      language: null,
      year: 2022,
      context: null,
      files: [],
      correctAlternative: 'C',
      alternativesIntroduction: 'Qual é o valor de log₁₀(1000)?',
      alternatives: [
        { letter: 'A', text: '2', file: null, isCorrect: false },
        { letter: 'B', text: '2,5', file: null, isCorrect: false },
        { letter: 'C', text: '3', file: null, isCorrect: true },
        { letter: 'D', text: '4', file: null, isCorrect: false },
        { letter: 'E', text: '10', file: null, isCorrect: false },
      ],
    },
    {
      title: 'Questão de Exemplo',
      index: 3,
      discipline: 'matematica',
      language: null,
      year: 2022,
      context: null,
      files: [],
      correctAlternative: 'A',
      alternativesIntroduction: 'Se f(x) = 2x² - 3x + 1, qual é o valor de f(2)?',
      alternatives: [
        { letter: 'A', text: '3', file: null, isCorrect: true },
        { letter: 'B', text: '5', file: null, isCorrect: false },
        { letter: 'C', text: '7', file: null, isCorrect: false },
        { letter: 'D', text: '9', file: null, isCorrect: false },
        { letter: 'E', text: '11', file: null, isCorrect: false },
      ],
    },
  ];
}
