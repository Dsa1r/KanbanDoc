import { useEffect, useState } from 'react';
import { extractAiAnswers, generateAiTasks } from '../services/aiService';
import './AddTaskModal.css'; // reuse overlay / modal / button styles
import './AiWizardModal.css';

// `key` values must match what the backend expects.
const QUESTIONS = [
  {
    key: 'product',
    title: 'What are you building?',
    hint: 'Describe the product in a sentence or two.',
    placeholder: 'e.g. A booking app for dental clinics',
  },
  {
    key: 'users',
    title: 'Who will use it?',
    hint: 'Main users and what they need to do.',
    placeholder: 'e.g. Receptionists and patients',
  },
  {
    key: 'features',
    title: 'What are the main features?',
    hint: 'Separate features with commas.',
    placeholder: 'e.g. appointments, patient records, reminders',
  },
  {
    key: 'stack',
    title: 'Which tech stack?',
    hint: 'Database, backend and frontend.',
    placeholder: 'e.g. PostgreSQL, Flask, React',
  },
  {
    key: 'timeline',
    title: 'What is the timeline?',
    hint: 'Deadline or number of weeks, and team size.',
    placeholder: 'e.g. 8 weeks, 3 developers',
  },
];

const PASTE_MIN = 20;
const PASTE_MAX = 15000;

export default function AiWizardModal({ projectId, onClose, onGenerated }) {
  const [mode, setMode] = useState('choose'); // 'choose' | 'paste' | 'questions'
  const [pasteText, setPasteText] = useState('');
  const [prefilled, setPrefilled] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const busy = loading || extracting;
  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const value = answers[question.key] || '';

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && !busy) onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [busy, onClose]);

  // Paste mode: read the text and fill the 5 answers
  async function analyze() {
    setExtracting(true);
    setError('');

    try {
      const found = await extractAiAnswers(projectId, pasteText.trim());
      setAnswers(found || {});
      setPrefilled(Object.values(found || {}).some(Boolean));
      setStep(0);
      setMode('questions');
    } catch (err) {
      setError(err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function generate() {
    const cleaned = Object.fromEntries(
      QUESTIONS.map((q) => [q.key, (answers[q.key] || '').trim()])
    );

    setLoading(true);
    setError('');

    try {
      const data = await generateAiTasks(projectId, cleaned);
      await onGenerated(data);
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;

    if (isLast) {
      generate();
    } else {
      setError('');
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setError('');
    if (step === 0) {
      setMode('choose');
    } else {
      setStep((s) => s - 1);
    }
  }

  function renderBody() {
    if (loading || extracting) {
      return (
        <div className="ai-wizard__loading" role="status">
          <div className="ai-wizard__spinner" aria-hidden="true" />
          <h2 className="add-task-modal__title" id="ai-wizard-title">
            {extracting ? 'Reading your text' : 'Building your tasks'}
          </h2>
          <p className="ai-wizard__hint">
            {extracting
              ? 'This takes a few seconds.'
              : 'This can take up to a minute. Please keep this window open.'}
          </p>
        </div>
      );
    }

    if (mode === 'choose') {
      return (
        <>
          <h2 className="add-task-modal__title" id="ai-wizard-title">
            How do you want to start?
          </h2>
          <div className="ai-wizard__choices">
            <button type="button" className="ai-wizard__choice" onClick={() => setMode('questions')}>
              <strong>Answer a few questions</strong>
              <span>Five short questions, one at a time.</span>
            </button>
            <button type="button" className="ai-wizard__choice" onClick={() => setMode('paste')}>
              <strong>Paste your requirements</strong>
              <span>Paste use cases or requirements and we fill the answers for you.</span>
            </button>
          </div>
          <div className="add-task-modal__actions">
            <button type="button" className="add-task-modal__cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </>
      );
    }

    if (mode === 'paste') {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pasteText.trim().length >= PASTE_MIN) analyze();
          }}
        >
          <h2 className="add-task-modal__title" id="ai-wizard-title">
            Paste your requirements
          </h2>
          <p className="ai-wizard__hint">
            Paste a project description, requirements, or use cases. You can review
            and edit the result before anything is generated.
          </p>

          <div className="add-task-modal__field">
            <label htmlFor="ai-wizard-paste" className="ai-wizard__sr">
              Requirements text
            </label>
            <textarea
              id="ai-wizard-paste"
              className="ai-wizard__paste"
              value={pasteText}
              maxLength={PASTE_MAX}
              placeholder="e.g. The system lets patients book appointments with their dentist…"
              onChange={(e) => setPasteText(e.target.value)}
              autoFocus
            />
            <span className="ai-wizard__count">
              {pasteText.length}/{PASTE_MAX}
            </span>
          </div>

          <p className="ai-wizard__note">
            Your text is sent to an external AI provider. Do not paste passwords or private data.
          </p>

          {error && (
            <p className="add-task-modal__error" role="alert">
              {error}
            </p>
          )}

          <div className="add-task-modal__actions">
            <button
              type="button"
              className="add-task-modal__cancel"
              onClick={() => {
                setError('');
                setMode('choose');
              }}
            >
              Back
            </button>
            <button
              type="submit"
              className="add-task-modal__submit"
              disabled={pasteText.trim().length < PASTE_MIN}
            >
              Analyze text
            </button>
          </div>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="ai-wizard__dots" aria-hidden="true">
          {QUESTIONS.map((q, i) => (
            <span
              key={q.key}
              className={`ai-wizard__dot ${i <= step ? 'ai-wizard__dot--on' : ''}`}
            />
          ))}
        </div>

        <p className="ai-wizard__step">
          Question {step + 1} of {QUESTIONS.length}
        </p>

        <h2 className="add-task-modal__title" id="ai-wizard-title">
          {question.title}
        </h2>

        <p className="ai-wizard__hint">
          {prefilled && value
            ? 'Filled from your text. Check it and edit if needed.'
            : question.hint}
        </p>

        <div className="add-task-modal__field">
          <label htmlFor="ai-wizard-answer" className="ai-wizard__sr">
            {question.title}
          </label>
          <textarea
            key={question.key}
            id="ai-wizard-answer"
            value={value}
            maxLength={1000}
            placeholder={question.placeholder}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [question.key]: e.target.value }))
            }
            autoFocus
          />
        </div>

        {error && (
          <p className="add-task-modal__error" role="alert">
            {error}
          </p>
        )}

        <div className="add-task-modal__actions">
          <button type="button" className="add-task-modal__cancel" onClick={handleBack}>
            Back
          </button>
          <button type="submit" className="add-task-modal__submit" disabled={!value.trim()}>
            {isLast ? 'Generate tasks' : 'Next'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className="add-task-overlay"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        className="add-task-modal ai-wizard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-wizard-title"
        onClick={(e) => e.stopPropagation()}
      >
        {renderBody()}
      </div>
    </div>
  );
}