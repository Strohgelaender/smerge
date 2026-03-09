/**
 * Ein Schritt im interaktiven Tutorial.
 */
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  view: 'graph' | 'snap';
  target?: {
    type: 'dom';
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  validation?: {
    type: 'click' | 'custom';
    condition?: () => boolean;
  };
  modal?: boolean;
  actions?: {
    highlight?: boolean;

  };
}

export interface TutorialSequence {
  id: string;
  name: string;
  steps: TutorialStep[];
}

