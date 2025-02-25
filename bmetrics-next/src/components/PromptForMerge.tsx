import React from 'react';
import componentStyles from '../styles/components.module.scss';

interface PromptForMergeProps {
  isVisible: boolean;
  behaviors: { id: string; name: string }[];
  onConfirm: (selectedBehaviorId: string) => void;
  onCancel: () => void;
}

const PromptForMerge: React.FC<PromptForMergeProps> = ({ isVisible, behaviors, onConfirm, onCancel }) => {
  const [selectedBehaviorId, setSelectedBehaviorId] = React.useState<string>('');

  if (!isVisible) return null;

  return (
    <div className={componentStyles.popupOverlay}>
      <div className={componentStyles.popupContent}>
        <h3>Select a Behavior to Merge Into</h3>
        <select
          value={selectedBehaviorId}
          onChange={(e) => setSelectedBehaviorId(e.target.value)}
          className={componentStyles.popupDropdown}
        >
          <option value="" disabled>
            Select a behavior
          </option>
          {behaviors.map((behavior) => (
            <option key={behavior.id} value={behavior.id}>
              {behavior.name}
            </option>
          ))}
        </select>
        <div className={componentStyles.popupActions}>
          <button onClick={() => onConfirm(selectedBehaviorId)} disabled={!selectedBehaviorId}>
            Confirm
          </button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PromptForMerge;