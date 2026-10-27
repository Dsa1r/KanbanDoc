import StageTag from './StageTag.jsx';

export default function NextUpBanner({ task, onOpen }) {
  return (
    <section className="next-up" aria-label="Next task">
      <div>
        <p className="next-up__label">
          Next up <span lang="ja">· 次</span>
        </p>
        <div className="next-up__task">
          <h2 className="next-up__title">{task.title}</h2>
          <StageTag stage={task.stage} />
        </div>
      </div>

      <button type="button" className="next-up__button" onClick={() => onOpen(task)}>
        Open task
      </button>
    </section>
  );
}