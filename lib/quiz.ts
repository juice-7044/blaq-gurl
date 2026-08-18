import type { TribeId } from './tribes'

/* ---------------------------------------------------------------------------
 * Tribe questions — each has A–D tribe options plus an "E" recharge-solo
 * option that scores 0 points but signals a season of rest.
 * ------------------------------------------------------------------------- */

export type TribeAnswer = TribeId | 'E'

export type QuizOption = {
  text: string
  value: TribeAnswer
}

export type QuizQuestion = {
  id: number
  question: string
  options: QuizOption[]
}

const REST_OPTION = (text: string): QuizOption => ({ text, value: 'E' })

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'When a group trip is being planned, you are the one who…',
    options: [
      { text: 'Builds the spreadsheet, budget, and itinerary', value: 'A' },
      { text: 'Makes sure everyone feels included and balanced', value: 'B' },
      { text: 'Finds the coolest experiences and negotiates the deals', value: 'C' },
      { text: 'Packs the teas, oils, and plans the rest-day', value: 'D' },
      REST_OPTION('Lets others take the lead — I need to conserve my energy'),
    ],
  },
  {
    id: 2,
    question: 'Your friends come to you when they need…',
    options: [
      { text: 'A plan, a system, or help with their money', value: 'A' },
      { text: 'Perspective, wisdom, and grounding', value: 'B' },
      { text: 'A push to bet on themselves', value: 'C' },
      { text: 'Healing, comfort, and a safe space', value: 'D' },
      REST_OPTION('Honestly, I’m protecting my energy right now'),
    ],
  },
  {
    id: 3,
    question: 'A free Saturday is best spent…',
    options: [
      { text: 'Organizing your closet + updating your planner', value: 'A' },
      { text: 'A mix of family time, meditation, and a hobby', value: 'B' },
      { text: 'Networking or working on your side hustle', value: 'C' },
      { text: 'Yoga, therapy, or exploring your sensual side', value: 'D' },
      REST_OPTION('Staying in bed, watching movies, and recharging solo'),
    ],
  },
  {
    id: 4,
    question: 'What’s your superpower right now?',
    options: [
      { text: 'Turning chaos into order', value: 'A' },
      { text: 'Staying calm while juggling 10 roles', value: 'B' },
      { text: 'Spotting money-making opportunities everywhere', value: 'C' },
      { text: 'Healing energy that makes others feel safe', value: 'D' },
      REST_OPTION('Just getting through the day — and that’s enough'),
    ],
  },
  {
    id: 5,
    question: 'How do you recharge?',
    options: [
      { text: 'Color-coded spreadsheets and a clean workspace', value: 'A' },
      { text: 'Quiet time with a book or spiritual practice', value: 'B' },
      { text: 'Listening to a business podcast or pitching ideas', value: 'C' },
      { text: 'A spa day or deep conversation with a friend', value: 'D' },
      REST_OPTION('Canceling plans and protecting my peace'),
    ],
  },
  {
    id: 6,
    question: 'Which quote resonates with you today?',
    options: [
      { text: '“Measure twice, cut once.”', value: 'A' },
      { text: '“You can’t pour from an empty cup.”', value: 'B' },
      { text: '“If you don’t build your dream, someone will hire you to build theirs.”', value: 'C' },
      { text: '“Healing is not linear, but it is possible.”', value: 'D' },
      REST_OPTION('“Rest is resistance.” — Tricia Hersey'),
    ],
  },
  {
    id: 7,
    question: 'What lights you up most?',
    options: [
      { text: 'Turning a messy idea into a working system', value: 'A' },
      { text: 'Helping someone find their balance', value: 'B' },
      { text: 'Launching something and watching it grow', value: 'C' },
      { text: 'Watching someone heal and feel whole', value: 'D' },
      REST_OPTION('Right now, a quiet day with no demands'),
    ],
  },
  {
    id: 8,
    question: 'Your dream contribution to the sisterhood is…',
    options: [
      { text: 'Building the structure that lets us thrive', value: 'A' },
      { text: 'Keeping us whole and grounded', value: 'B' },
      { text: 'Inspiring us to build empires', value: 'C' },
      { text: 'Helping us heal and glow', value: 'D' },
      REST_OPTION('Simply showing up when I can — and that counts'),
    ],
  },
  {
    id: 9,
    question: 'The book on your nightstand is most likely about…',
    options: [
      { text: 'Money, business, or productivity', value: 'A' },
      { text: 'Motherhood, faith, or personal growth', value: 'B' },
      { text: 'Entrepreneurship or a bold memoir', value: 'C' },
      { text: 'Wellness, spirituality, or healing', value: 'D' },
      REST_OPTION('Whatever helps me escape and rest my mind'),
    ],
  },
  {
    id: 10,
    question: 'At the end of a trip, success feels like…',
    options: [
      { text: 'Everything ran smoothly and on budget', value: 'A' },
      { text: 'Everyone left feeling seen and balanced', value: 'B' },
      { text: 'New connections and business ideas sparked', value: 'C' },
      { text: 'We all feel restored and renewed', value: 'D' },
      REST_OPTION('I finally got the rest I needed'),
    ],
  },
]

/* ---------------------------------------------------------------------------
 * MBTI questions — forced binary choice, 2 per axis (E/I, S/N, T/F, J/P).
 * ------------------------------------------------------------------------- */

export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP'
export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export type MbtiOption = { text: string; letter: MbtiLetter }
export type MbtiQuestion = {
  id: number
  axis: MbtiAxis
  question: string
  options: [MbtiOption, MbtiOption]
}

export const mbtiQuestions: MbtiQuestion[] = [
  {
    id: 1,
    axis: 'EI',
    question: 'After a long week, you feel most restored by…',
    options: [
      { text: 'Being around people — a dinner, a group chat, a night out', letter: 'E' },
      { text: 'Solo time to think and reset in your own space', letter: 'I' },
    ],
  },
  {
    id: 2,
    axis: 'EI',
    question: 'In a new group, you usually…',
    options: [
      { text: 'Jump in, introduce yourself, and get things going', letter: 'E' },
      { text: 'Observe first and warm up once you feel comfortable', letter: 'I' },
    ],
  },
  {
    id: 3,
    axis: 'SN',
    question: 'You’re more drawn to…',
    options: [
      { text: 'Concrete facts, details, and what’s proven to work', letter: 'S' },
      { text: 'Big-picture ideas, patterns, and what could be', letter: 'N' },
    ],
  },
  {
    id: 4,
    axis: 'SN',
    question: 'When learning something new, you prefer…',
    options: [
      { text: 'Step-by-step, hands-on, practical instructions', letter: 'S' },
      { text: 'The concept and “why” first, then figure out the rest', letter: 'N' },
    ],
  },
  {
    id: 5,
    axis: 'TF',
    question: 'When making a tough decision, you lead with…',
    options: [
      { text: 'Logic, fairness, and the most objective outcome', letter: 'T' },
      { text: 'Values, empathy, and how people will be affected', letter: 'F' },
    ],
  },
  {
    id: 6,
    axis: 'TF',
    question: 'People are more likely to describe you as…',
    options: [
      { text: 'Direct and analytical', letter: 'T' },
      { text: 'Warm and considerate', letter: 'F' },
    ],
  },
  {
    id: 7,
    axis: 'JP',
    question: 'Your ideal trip is…',
    options: [
      { text: 'Planned out with a clear itinerary', letter: 'J' },
      { text: 'Open and spontaneous — decide as you go', letter: 'P' },
    ],
  },
  {
    id: 8,
    axis: 'JP',
    question: 'Your to-do list is usually…',
    options: [
      { text: 'Written down, ordered, and checked off', letter: 'J' },
      { text: 'Loose and flexible — you keep options open', letter: 'P' },
    ],
  },
]

/* ---------------------------------------------------------------------------
 * Scoring
 * ------------------------------------------------------------------------- */

export type TribeScores = Record<TribeId, number>

export type QuizResult = {
  primary: TribeId
  secondary: TribeId | null // present when the result is a hybrid
  isHybrid: boolean
  scores: TribeScores
  /** Percentage share per tribe (0–100), summing ~100 across scored answers */
  percentages: TribeScores
  restCount: number
  restSeason: boolean
  mbti: string // 4-letter type, e.g. "ENFJ"
}

export function scoreTribes(answers: TribeAnswer[]): {
  scores: TribeScores
  restCount: number
} {
  const scores: TribeScores = { A: 0, B: 0, C: 0, D: 0 }
  let restCount = 0
  answers.forEach((a) => {
    if (a === 'E') restCount += 1
    else scores[a] += 2 // 2 points per tribe answer, per spec
  })
  return { scores, restCount }
}

export function computeMbti(answers: MbtiLetter[]): string {
  const tally: Record<MbtiLetter, number> = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  }
  answers.forEach((l) => (tally[l] += 1))
  // Deterministic tie-breakers favor the more community-forward type.
  const ei = tally.E >= tally.I ? 'E' : 'I'
  const sn = tally.N >= tally.S ? 'N' : 'S'
  const tf = tally.F >= tally.T ? 'F' : 'T'
  const jp = tally.J >= tally.P ? 'J' : 'P'
  return `${ei}${sn}${tf}${jp}`
}

export function buildResult(
  tribeAnswers: TribeAnswer[],
  mbtiAnswers: MbtiLetter[],
): QuizResult {
  const { scores, restCount } = scoreTribes(tribeAnswers)

  // Rank tribes by points.
  const ranked = (Object.keys(scores) as TribeId[]).sort(
    (a, b) => scores[b] - scores[a],
  )
  const primary = ranked[0]
  const second = ranked[1]
  // Hybrid when the top two are close (within 2 points = one answer) and the
  // second tribe actually scored.
  const isHybrid = scores[second] > 0 && scores[primary] - scores[second] <= 2
  const secondary = isHybrid ? second : null

  const totalPoints =
    scores.A + scores.B + scores.C + scores.D || 1
  const percentages: TribeScores = {
    A: Math.round((scores.A / totalPoints) * 100),
    B: Math.round((scores.B / totalPoints) * 100),
    C: Math.round((scores.C / totalPoints) * 100),
    D: Math.round((scores.D / totalPoints) * 100),
  }

  return {
    primary,
    secondary,
    isHybrid,
    scores,
    percentages,
    restCount,
    restSeason: restCount >= 3,
    mbti: computeMbti(mbtiAnswers),
  }
}
