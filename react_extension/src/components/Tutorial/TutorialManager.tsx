import { TutorialStep } from '../../types/tutorial';
import TutorialOverlay from './TutorialOverlay';
import React from "react";

interface TutorialManagerProps {
  isActive: boolean;
  currentStep: TutorialStep | null;
  progress: { current: number; total: number };
  isLastStep: boolean;
  onNextStep: () => void;
  onCloseTutorial: () => void;
  onNodeDoubleClick?: (nodeId: string) => void;
}

export const TutorialManager: React.FC<TutorialManagerProps> = ({
  isActive,
  currentStep,
  progress,
  isLastStep,
  onNextStep,
  onCloseTutorial,
}) => {
  if (!isActive || !currentStep) {
    return null;
  }

  return (
    <TutorialOverlay
      step={currentStep}
      progress={progress}
      isLastStep={isLastStep}
      onNext={onNextStep}
      onClose={onCloseTutorial}
    />
  );
};
