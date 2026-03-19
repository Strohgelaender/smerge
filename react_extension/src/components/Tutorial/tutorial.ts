/**
 * Ein Schritt im interaktiven Tutorial.
 */
export interface TutorialStep {
  id: string;
  title?: string; // Translation-Key
  description?: string; // Translation-Key
  // Anzeigemodus des Schritts
  // modal = Zentriert in der mitte
  // small = kein Text, Button "weiter im Tutorial" über der Navbar. Lässt Platz für Arbeit mit der Seite
  // kein Wert = In der via target spezifizierten Position
  mode?: 'modal' | 'small';
  target?: { // Selector, neben dem das tutorial platziert werden soll.
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left';
  };
  validation?: {
    type: 'click' | 'custom';
    condition?: () => boolean;
  };
}

export interface TutorialSequence {
  id: string;
  name: string;
  steps: TutorialStep[];
}

