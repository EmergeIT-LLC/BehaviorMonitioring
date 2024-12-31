import React from 'react';
import componentStyles from '../styles/components.module.scss';

interface PopoutPromptProps {
    title: string;
    message: string;
    isVisible: boolean;
    behaviorNameSelected: string;
    onConfirm: (selectedBehaviorId: string) => void;
    onCancel: () => void;
}

const PopoutPrompt: React.FC<PopoutPromptProps> = ({ title, message, isVisible, behaviorNameSelected, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
        <div className={componentStyles.popupOverlay}>
            <div className={componentStyles.popupContent}>
                <h1>{title}</h1>
                <h3>{message}</h3>
                <div className={componentStyles.popupActions}>
                    <button onClick={() => onConfirm(behaviorNameSelected)} aria-label={`Confirm selection of ${behaviorNameSelected}`}>Yes</button>
                    <button onClick={onCancel} aria-label="Cancel selection">No</button>
                </div>
            </div>
        </div>
    );
};

export default PopoutPrompt;