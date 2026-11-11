import { useEffect, useState } from 'react';
import { generateAiTasks } from '../services/aiService';
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

export default function AiWizardModal({ projectId, onClose, onGenerated }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const value = answers[question.key] || '';

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && !loading) onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loading, onClose]);

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
    if (step === 0) {
      onClose();
    } else {
      setError('');
      setStep((s) => s - 1);
    }
  }

  return (
    <div
      className="add-task-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="add-task-modal ai-wizard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-wizard-title"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="ai-wizard__loading" role="status">
            <div className="ai-wizard__spinner" aria-hidden="true" />
            <h2 className="add-task-modal__title" id="ai-wizard-title">
              Building your tasks
            </h2>
            <p className="ai-wizard__hint">
              This can take up to a minute. Please keep this window open.
            </p>
          </div>
        ) : (
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

            <p className="ai-wizard__hint">{question.hint}</p>

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
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              <button
                type="submit"
                className="add-task-modal__submit"
                disabled={!value.trim()}
              >
                {isLast ? 'Generate tasks' : 'Next'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}