import ReactMarkdown from 'react-markdown'
import { useState, type FormEvent } from 'react'
import { normalizeMarkdown } from './utils/markdownNormalizer'
import './App.css'

type Source = {
  title: string
  url: string
}

type TutorResponse = {
  mode: 'curated' | 'ai'
  label?: string
  title?: string
  answer: string
  sources: Source[]
}

type QuizQuestion = {
  id: number
  question: string
  options: string[]
}

type QuizResult = {
  questionId: number
  selectedOption: number
  correctOption: number
  isCorrect: boolean
  explanation: string
}

type QuizResponse = {
  total: number
  score: number
  percentage: number
  results: QuizResult[]
}

const API_BASE_URL = 'http://localhost:3000/api'
const ASK_URL = `${API_BASE_URL}/ask`
const QUIZ_URL = `${API_BASE_URL}/quiz`
const QUIZ_SUBMIT_URL = `${API_BASE_URL}/quiz/submit`

const suggestedQuestions = [
  'What is cloud computing?',
  'Explain Azure availability zones.',
  'What is the difference between IaaS, PaaS, and SaaS?',
  'What is an Azure region?',
  'What is the shared responsibility model?',
  'What is the difference between public and private cloud?',
  'How does Azure pricing work?',
  'Eleza maana ya Cloud Computing kwa Kiswahili',
]

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<TutorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({})
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizSubmitting, setQuizSubmitting] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [quizResult, setQuizResult] = useState<QuizResponse | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || loading) {
      return
    }

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      const response = await fetch(ASK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not retrieve a lesson.')
      }

      setAnswer(data as TutorResponse)
    } catch {
      setError(
        'Could not reach the learning service. Check that your backend is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function startQuiz() {
    if (quizLoading) {
      return
    }

    setQuizLoading(true)
    setQuizError('')
    setQuizResult(null)
    setSelectedAnswers({})

    try {
      const response = await fetch(QUIZ_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not load the quiz.')
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No quiz questions are available yet.')
      }

      setQuizQuestions(data.questions as QuizQuestion[])
      setQuizStarted(true)
    } catch (err) {
      setQuizError(
        err instanceof Error
          ? err.message
          : 'Could not load the quiz. Check that your backend is running.',
      )
    } finally {
      setQuizLoading(false)
    }
  }

  function selectAnswer(questionId: number, optionIndex: number) {
    if (quizSubmitting || quizResult) {
      return
    }

    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }))
  }

  async function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (quizSubmitting || quizResult) {
      return
    }

    if (Object.keys(selectedAnswers).length !== quizQuestions.length) {
      setQuizError('Please answer every question before submitting.')
      return
    }

    setQuizSubmitting(true)
    setQuizError('')

    const answers = quizQuestions.map((item) => ({
      questionId: item.id,
      selectedOption: selectedAnswers[item.id],
    }))

    try {
      const response = await fetch(QUIZ_SUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not submit your answers.')
      }

      setQuizResult(data as QuizResponse)
    } catch (err) {
      setQuizError(
        err instanceof Error
          ? err.message
          : 'Could not submit the quiz. Check your backend connection.',
      )
    } finally {
      setQuizSubmitting(false)
    }
  }

  function retryQuiz() {
    setSelectedAnswers({})
    setQuizResult(null)
    setQuizError('')
    setQuizStarted(false)
    setQuizQuestions([])
  }

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="CloudReady AI home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            CloudReady <strong>AI</strong>
          </span>
        </a>
        <span className="header-label">AZ-900 STUDY BUDDY</span>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span className="status-dot" />
          YOUR CLOUD LEARNING COMPANION
        </div>

        <h1>
          Understand the cloud.
          <br />
          <span>Learn with confidence.</span>
        </h1>

        <p className="intro">
          Explore Azure concepts in simple language, discover practical
          examples, and prepare for your cloud learning journey.
        </p>

        <div className="chat-card">
          <div className="assistant-heading">
            <div className="assistant-avatar">CR</div>
            <div>
              <h2>Your AZ-900 Study Buddy</h2>
              <p>Learn from prepared explanations and trusted resources.</p>
            </div>
          </div>

          <div className="welcome-message">
            <strong>Habari! Ready to learn?</strong>
            <p>
              Ask any Azure Fundamentals (AZ-900) question. Powered by Gemini AI
              with relatable African examples, Kiswahili support, and automatic
              offline lesson fallback.
            </p>
          </div>

          <p className="suggestions-label">TRY ASKING</p>

          <div className="suggestions">
            {suggestedQuestions.map((item) => (
              <button
                className="suggestion"
                key={item}
                type="button"
                disabled={loading}
                onClick={() => setQuestion(item)}
              >
                {item}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <form className="question-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="question">
              Your cloud computing question
            </label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about a supported Azure topic..."
              maxLength={1000}
              disabled={loading}
            />
            <button type="submit" disabled={!question.trim() || loading}>
              {loading ? 'Loading…' : 'Learn'}
              {!loading && <span aria-hidden="true"> →</span>}
            </button>
          </form>

          <p className="input-note">
            AI-powered AZ-900 tutor · Kenyan examples · Kiswahili support
          </p>

          {loading && (
            <p role="status" aria-live="polite">
              Finding your lesson…
            </p>
          )}

          {error && (
            <div className="welcome-message" role="alert">
              <strong>Unable to load the lesson</strong>
              <p>{error}</p>
            </div>
          )}

          {answer && (
            <section className="welcome-message" aria-live="polite">
              {answer.mode === 'ai' ? (
                <div className="mode-badge mode-badge-ai">⚡ Live AI Study Buddy</div>
              ) : (
                <div className="mode-badge mode-badge-curated">
                  📚 Curated Lesson (Offline Fallback)
                </div>
              )}
              {answer.label && (
                <p className="suggestions-label">{answer.label}</p>
              )}
              {answer.title && <h2>{answer.title}</h2>}
              <div className="lesson-answer">
                <ReactMarkdown>{normalizeMarkdown(answer.answer)}</ReactMarkdown>
              </div>

              <h3>Trusted learning resources</h3>
              <ul>
                {answer.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>

      <section className="quiz-section" aria-labelledby="quiz-heading">
        <div className="quiz-heading">
          <p className="suggestions-label">TEST YOUR KNOWLEDGE</p>
          <h2 id="quiz-heading">AZ-900 Knowledge Check</h2>
          <p>
            Practise cloud fundamentals, check your score, and learn from
            explanations after you submit.
          </p>
        </div>

        {!quizStarted && (
          <div className="quiz-start">
            <div>
              <strong>Ready for a quick challenge?</strong>
              <p>Five multiple-choice questions. Answers are checked by the server.</p>
            </div>
            <button
              type="button"
              onClick={startQuiz}
              disabled={quizLoading}
            >
              {quizLoading ? 'Loading quiz…' : 'Start quiz'}
            </button>
          </div>
        )}

        {quizError && (
          <div className="welcome-message" role="alert">
            <strong>Quiz message</strong>
            <p>{quizError}</p>
          </div>
        )}

        {quizStarted && (
          <form className="quiz-form" onSubmit={submitQuiz}>
            <div className="quiz-progress">
              <span>
                {Object.keys(selectedAnswers).length} of {quizQuestions.length}{' '}
                answered
              </span>
              <span>Choose one option per question</span>
            </div>

            {quizQuestions.map((item, index) => {
              const result = quizResult?.results.find(
                (entry) => entry.questionId === item.id,
              )

              return (
                <fieldset className="quiz-question" key={item.id}>
                  <legend>
                    <span className="question-number">
                      Question {index + 1}
                    </span>
                    <span>{item.question}</span>
                  </legend>

                  <div className="quiz-options">
                    {item.options.map((option, optionIndex) => {
                      const isSelected =
                        selectedAnswers[item.id] === optionIndex
                      const isCorrect =
                        result?.correctOption === optionIndex

                      let optionClass = 'quiz-option'

                      if (isSelected) {
                        optionClass += ' selected'
                      }

                      if (result && isCorrect) {
                        optionClass += ' correct'
                      } else if (result && isSelected && !result.isCorrect) {
                        optionClass += ' incorrect'
                      }

                      return (
                        <label className={optionClass} key={option}>
                          <input
                            type="radio"
                            name={`question-${item.id}`}
                            value={optionIndex}
                            checked={isSelected}
                            onChange={() =>
                              selectAnswer(item.id, optionIndex)
                            }
                            disabled={Boolean(quizResult) || quizSubmitting}
                          />
                          <span className="option-letter">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="option-text">{option}</span>
                          {result && isCorrect && (
                            <span className="option-feedback">
                              Correct answer
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>

                  {result && (
                    <div
                      className={`quiz-explanation ${
                        result.isCorrect ? 'explanation-correct' : 'explanation-incorrect'
                      }`}
                    >
                      <strong>
                        {result.isCorrect ? 'Well done!' : 'Keep learning'}
                      </strong>
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </fieldset>
              )
            })}

            {!quizResult ? (
              <button
                className="quiz-submit"
                type="submit"
                disabled={
                  quizSubmitting ||
                  Object.keys(selectedAnswers).length !== quizQuestions.length
                }
              >
                {quizSubmitting ? 'Checking answers…' : 'Submit answers'}
              </button>
            ) : (
              <div className="quiz-results" role="status" aria-live="polite">
                <p className="suggestions-label">YOUR RESULTS</p>
                <h3>
                  You scored {quizResult.score} out of {quizResult.total}
                </h3>
                <p className="quiz-percentage">{quizResult.percentage}%</p>
                <p>
                  {quizResult.percentage === 100
                    ? 'Excellent work! You answered every question correctly.'
                    : 'Review the explanations above, then try again to improve your score.'}
                </p>
                <button type="button" onClick={retryQuiz}>
                  Try again
                </button>
              </div>
            )}
          </form>
        )}
      </section>

      <footer className="footer">
        <p>
          CloudReady AI is an independent educational project. It is not
          affiliated with or endorsed by Microsoft.
        </p>
        <span>Learn today. Build tomorrow.</span>
      </footer>
    </main>
  )
}

export default App
