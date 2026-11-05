import { useEffect, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import { getProjectDetails } from '../services/projectsService.js';
import './CreateProjectModal.css';
import './EditProjectModal.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DESCRIPTION_MAX_LENGTH = 200;

function EditProjectModal({ projectId, onClose, onSave }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    getProjectDetails(projectId)
      .then((project) => {
        if (ignore) return;
        setTitle(project.title);
        setDescription(project.description);
        setMembers(project.members);
      })
      .catch((error) => {
        if (!ignore) setLoadError(error.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId]);

  function addMember() {
    const email = memberEmail.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      setMemberError('Enter a valid email address.');
      return;
    }
    if (members.some((member) => member.email === email)) {
      setMemberError('This member is already in the project.');
      return;
    }

    setMembers((prevMembers) => [...prevMembers, { email, isOwner: false, isNew: true }]);
    setMemberEmail('');
    setMemberError('');
  }

  function removeMember(email) {
    setMembers((prevMembers) => prevMembers.filter((member) => member.email !== email));
  }

  function handleMemberKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMember();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Give your project a name.');
      return;
    }

    setSubmitError('');
    setIsSaving(true);
    try {
      await onSave({
        title: trimmedTitle,
        description: description.trim(),
        memberEmails: members.filter((member) => !member.isOwner).map((member) => member.email),
      });
    } catch (error) {
      setSubmitError(error.message);
      setIsSaving(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !isSaving) {
      onClose();
    }
  }

  function renderBody() {
    if (isLoading) {
      return <p className="edit-members__status">Loading project…</p>;
    }

    if (loadError) {
      return <p className="project-modal__alert" role="alert">{loadError}</p>;
    }

    return (
      <>
        {submitError && <p className="project-modal__alert" role="alert">{submitError}</p>}

        <div className="project-modal__field">
          <label className="project-modal__label" htmlFor="edit-project-name">Project name</label>
          <input
            id="edit-project-name"
            className={`project-modal__input ${titleError ? 'project-modal__input--invalid' : ''}`}
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError('');
            }}
            maxLength={60}
            aria-invalid={Boolean(titleError)}
            autoFocus
          />
          {titleError && <p className="project-modal__error">{titleError}</p>}
        </div>

        <div className="project-modal__field">
          <label className="project-modal__label" htmlFor="edit-project-description">
            Description <span className="project-modal__optional">(optional)</span>
          </label>
          <textarea
            id="edit-project-description"
            className="project-modal__input project-modal__textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={DESCRIPTION_MAX_LENGTH}
          />
          <span className="project-modal__counter">
            {description.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>

        <div className="project-modal__field">
          <span className="project-modal__label">Members</span>
          <ul className="edit-members">
            {members.map((member) => (
              <li key={member.email} className="edit-members__row">
                <span className="edit-members__avatar" aria-hidden="true">
                  {member.email.charAt(0).toUpperCase()}
                </span>
                <span className="edit-members__email">{member.email}</span>

                {member.isOwner && <span className="edit-members__badge">Owner</span>}
                {member.isNew && (
                  <span className="edit-members__badge edit-members__badge--new">New</span>
                )}

                {!member.isOwner && (
                  <button
                    type="button"
                    className="edit-members__remove"
                    aria-label={`Remove ${member.email}`}
                    onClick={() => removeMember(member.email)}
                  >
                    <CloseIcon width={14} height={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="member-input">
            <input
              className="project-modal__input"
              type="email"
              value={memberEmail}
              onChange={(event) => {
                setMemberEmail(event.target.value);
                setMemberError('');
              }}
              onKeyDown={handleMemberKeyDown}
              placeholder="Member@gmail.com"
              aria-label="New member email"
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
          {memberError && <p className="project-modal__error" role="alert">{memberError}</p>}
        </div>
      </>
    );
  }

  return (
    <div
      className="project-modal-overlay"
      onClick={isSaving ? undefined : onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="project-modal__form" onSubmit={handleSubmit} noValidate>
          <header className="project-modal__header">
            <div>
              <h2 id="edit-project-title" className="project-modal__title">Edit project</h2>
              <p className="project-modal__subtitle">
                Update the details and manage who can work on it.
              </p>
            </div>
            <button
              type="button"
              className="project-modal__close"
              aria-label="Close"
              onClick={onClose}
              disabled={isSaving}
            >
              <CloseIcon width={18} height={18} />
            </button>
          </header>

          <div className="project-modal__body">{renderBody()}</div>

          <footer className="project-modal__actions">
            <button
              type="button"
              className="project-modal__cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="project-modal__submit"
              disabled={isSaving || isLoading || Boolean(loadError)}
            >
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;