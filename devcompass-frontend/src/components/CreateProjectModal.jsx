import { useState } from 'react';
import './CreateProjectModal.css';

const TEMPLATE_OPTIONS = [
  {
    id: 0,
    label: 'Blank project',
    description: 'Start from scratch and add your own tasks.',
  },
  {
    id: 1,
    label: 'Starter template',
    description: 'Comes with ready-made stages and tasks.',
  },
];

function CreateProjectModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Project name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title: trimmedTitle, templateId });
    } catch (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={isSubmitting ? undefined : onClose} onKeyDown={handleKeyDown}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="create-project-title" className="modal__title">New Project</h2>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <label className="modal__field">
            <span className="modal__label">Project name</span>
            <input
              className="modal__input"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError('');
              }}
              placeholder="e.g. Website Redesign"
              maxLength={60}
              autoFocus
            />
          </label>

          {error && <p className="modal__error" role="alert">{error}</p>}

          <fieldset className="modal__templates">
            <legend className="modal__label">Template</legend>

            {TEMPLATE_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`template-option ${templateId === option.id ? 'template-option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="template"
                  value={option.id}
                  checked={templateId === option.id}
                  onChange={() => setTemplateId(option.id)}
                  className="template-option__radio"
                />
                <span>
                  <span className="template-option__label">{option.label}</span>
                  <span className="template-option__description">{option.description}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="modal__actions">
            <button type="button" className="modal__cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="modal__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;