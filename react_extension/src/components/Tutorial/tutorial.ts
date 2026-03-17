/**
 * Ein Schritt im interaktiven Tutorial.
 */
export interface TutorialStep {
  id: string;
  title?: string;
  description?: string;
  view: 'graph' | 'snap';
  mode?: 'modal' | 'small'; // Modal = zentriert, small = Button "weiter in Tutorial", kein Wert = Neben dem target
  target?: { // Selector, neben dem das tutorial platziert werden soll.
    type: 'dom';
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  validation?: {
    type: 'click' | 'custom';
    condition?: () => boolean;
  };
  actions?: {
    highlight?: boolean;

  };
}

export interface TutorialSequence {
  id: string;
  name: string;
  steps: TutorialStep[];
}

