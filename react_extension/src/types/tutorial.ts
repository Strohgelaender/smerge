/**
 * Ein Schritt im interaktiven Tutorial.
 */
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  view: 'graph' | 'snap';
  target: {
    type: 'dom' | 'none';
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  validation?: {
    type: 'click' | 'custom';
    condition?: () => boolean;
  };
  actions?: {
    highlight?: boolean;
    modal?: boolean;
  };
}

export interface TutorialSequence {
  id: string;
  name: string;
  steps: TutorialStep[];
}

