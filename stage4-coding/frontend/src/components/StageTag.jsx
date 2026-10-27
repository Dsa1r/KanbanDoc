import { STAGES } from '../data/mockBoard.js';

export default function StageTag({ stage }) {
  const label = STAGES.find((item) => item.id === stage)?.label ?? stage;

  return <span className={`stage-tag stage-tag--${stage}`}>{label}</span>;
}