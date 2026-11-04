import { useState } from 'react';
import { CheckIcon, CloseIcon, UserIcon, UsersIcon } from './Icons.jsx';
import './CreateProjectModal.css';

const AUDIENCE_OPTIONS = [
  { id: 'solo', label: 'Solo', description: 'Just for you', Icon: UserIcon },
  { id: 'team', label: 'Team', description: 'Invite members', Icon: UsersIcon },
];

const TEMPLATE_OPTIONS = [
  {
    id: 1,
    label: 'Pre-seeded Fixed Template',
    description: 'Start with all core stages, recommended tasks, and project details ready to go.',
  },
  {
    id: 0,
    label: 'Blank Slate Custom Template',
    description: 'Keep the 3 core development stages intact while clearing all task details.',
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESCRIPTION_MAX_LENGTH = 200;

function CreateProjectModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('solo');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [templateId, setTemplateId] = useState(1);
  const [errors, setErrors] = useState({});
  const [memberError, setMemberError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasErrors = Object.values(errors).some(Boolean);

  function clearError(field) {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Give your project a name.';
    }

    if (audience === 'team' && members.length === 0) {
      nextErrors.members = memberEmail.trim()
        ? 'Press "Add" to include this email, or switch to Solo.'
        : 'Add at least one team member, or switch to Solo.';
    }

    return nextErrors;
  }

  function addMember() {
    const email = memberEmail.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      setMemberError('Enter a valid email address.');
      return;
    }
    if (members.includes(email)) {
      setMemberError('This member is already added.');
      return;
    }

    setMembers((prevMembers) => [...prevMembers, email]);
    setMemberEmail('');
    setMemberError('');
    clearError('members');
  }

  function removeMember(email) {
    setMembers((prevMembers) => prevMembers.filter((item) => item !== email));
  }

  function handleMemberKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMember();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        templateId,
        audience,
        members: audience === 'team' ? members : [],
      });
    } catch (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  }

  return (
    <div
      className="project-modal-overlay"
      onClick={isSubmitting ? undefined : onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="project-modal__form" onSubmit={handleSubmit} noValidate>
          <header className="project-modal__header">
            <div>
              <h2 id="create-project-title" className="project-modal__title">
                Generate a new project
              </h2>
              <p className="project-modal__subtitle">
                Name your workspace and choose a starting point.
              </p>
            </div>
            <button
              type="button"
              className="project-modal__close"
              aria-label="Close"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <CloseIcon width={18} height={18} />
            </button>
          </header>

          <div className="project-modal__body">
            {submitError && (
              <p className="project-modal__alert" role="alert">{submitError}</p>
            )}

            <div className="project-modal__field">
              <label className="project-modal__label" htmlFor="project-name">
                Project name
              </label>
              <input
                id="project-name"
                className={`project-modal__input ${errors.title ? 'project-modal__input--invalid' : ''}`}
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearError('title');
                }}
                placeholder="e.g. Spring product launch"
                maxLength={60}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'project-name-error' : undefined}
                autoFocus
              />
              {errors.title && (
                <p id="project-name-error" className="project-modal__error">{errors.title}</p>
              )}
            </div>

            <div className="project-modal__field">
              <label className="project-modal__label" htmlFor="project-description">
                Description <span className="project-modal__optional">(optional)</span>
              </label>
              <textarea
                id="project-description"
                className="project-modal__input project-modal__textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What are you building, and who is it for?"
                rows={3}
                maxLength={DESCRIPTION_MAX_LENGTH}
              />
              <span className="project-modal__counter">
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>

            <fieldset className="project-modal__group">
              <legend className="project-modal__label">Who is this project for?</legend>
              <div className="audience-options">
                {AUDIENCE_OPTIONS.map(({ id, label, description: optionDescription, Icon }) => {
                  const isSelected = audience === id;

                  return (
                    <label
                      key={id}
                      className={`audience-option ${isSelected ? 'audience-option--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value={id}
                        checked={isSelected}
                        onChange={() => {
                          setAudience(id);
                          clearError('members');
                        }}
                        className="project-modal__radio"
                      />
                      <span className="audience-option__icon">
                        <Icon width={18} height={18} />
                      </span>
                      <span>
                        <span className="audience-option__label">{label}</span>
                        <span className="audience-option__description">{optionDescription}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {audience === 'team' && (
              <div className="project-modal__field">
                <label className="project-modal__label" htmlFor="member-email">
                  Add team members by email
                </label>
                <div className="member-input">
                  <input
                    id="member-email"
                    className={`project-modal__input ${errors.members ? 'project-modal__input--invalid' : ''}`}
                    type="email"
                    value={memberEmail}
                    onChange={(event) => {
                      setMemberEmail(event.target.value);
                      setMemberError('');
                    }}
                    onKeyDown={handleMemberKeyDown}
                    placeholder="Member@gmail.com"
                    aria-invalid={Boolean(errors.members)}
                  />
                  <button
                    type="button"
                    className="member-input__add"
                    onClick={addMember}
                    disabled={!memberEmail.trim()}
                  >
                    Add
                  </button>
                </div>

                {memberError && (
                  <p className="project-modal__error" role="alert">{memberError}</p>
                )}
                {errors.members && (
                  <p className="project-modal__error">{errors.members}</p>
                )}

                {members.length > 0 && (
                  <ul className="member-list">
                    {members.map((email) => (
                      <li key={email} className="member-chip">
                        {email}
                        <button
                          type="button"
                          className="member-chip__remove"
                          aria-label={`Remove ${email}`}
                          onClick={() => removeMember(email)}
                        >
                          <CloseIcon width={12} height={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <fieldset className="project-modal__group">
              <legend className="project-modal__label">Choose a template</legend>
              {TEMPLATE_OPTIONS.map((option) => {
                const isSelected = templateId === option.id;

                return (
                  <label
                    key={option.id}
                    className={`template-option ${isSelected ? 'template-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setTemplateId(option.id)}
                      className="project-modal__radio"
                    />
                    <span className="template-option__check" aria-hidden="true">
                      {isSelected && <CheckIcon width={12} height={12} />}
                    </span>
                    <span>
                      <span className="template-option__label">{option.label}</span>
                      <span className="template-option__description">{option.description}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </div>

          <footer className="project-modal__actions">
            {hasErrors && (
              <p className="project-modal__hint" role="status">
                Please complete the highlighted fields.
              </p>
            )}
            <button
              type="button"
              className="project-modal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="project-modal__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Generating…' : 'Generate Project'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;