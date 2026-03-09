import {TutorialSequence} from "../types/tutorial";

/**
 * Interaktives smerge Tutorial.
 * Hier werden die einzelnen Tutorial-Schritte definiert.
 */
export const SMERGE_TUTORIAL: TutorialSequence = {
    id: 'smerge-tutorial',
    name: 'tutorial.name',
    steps: [
        {
            id: 'welcome',
            title: 'tutorial.welcome.title',
            description: 'tutorial.welcome.description',
            view: 'graph',
            target: {
                type: 'none',
                selector: ''
            },
            actions: {
                modal: true
            }
        },
        {
            id: 'explain_overview',
            title: 'tutorial.overview.title',
            description: 'tutorial.overview.description',
            view: 'graph',
            target: {
                type: 'none',
                selector: ''
            },
            actions: {
                modal: true
            }
        },
        {
            id: 'open_snap',
            title: 'tutorial.open_snap.title',
            description: 'tutorial.open_snap.description',
            view: 'graph',
            target: {
                type: 'dom',
                // Wir wollen die Node im Graphen hervorheben.
                // Da diese ein canvas ist selecte ich die commitmessage daneben.
                // nth-child um nicht im Kontextmenü zu landen.
                selector: '.__________cytoscape_container > div:nth-child(2) .commitmessage',
                position: 'top'
            },
            validation: {
                type: 'click' // Klick auf die Node im Graphen
            },
        },
        {
            id: 'edit_snap',
            title: 'tutorial.edit_snap.title',
            description: 'tutorial.edit_snap.description',
            view: 'snap',
            target: {
                type: 'none',
                selector: ''
            },
            actions: {
                modal: true
            }
        }
    ]
};

/**
 * All available tutorial sequences
 */
export const TUTORIAL_SEQUENCES: Record<string, TutorialSequence> = {
    'smerge-tutorial': SMERGE_TUTORIAL
};
