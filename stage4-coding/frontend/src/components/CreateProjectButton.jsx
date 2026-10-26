import './CreateProjectButton.css';

function CreateProjectButton({ onClick }) {
  return (
    <button type="button" className="create-button" onClick={onClick}>
      <span className="create-button__plus" aria-hidden="true">+</span>
      Generate New Project
    </button>
  );
}

export default CreateProjectButton;