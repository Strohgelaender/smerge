import {TutorialSequence} from "../components/Tutorial/tutorial.ts";

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
            modal: true
        },
        {
            id: 'explain_overview',
            title: 'tutorial.overview.title',
            description: 'tutorial.overview.description',
            view: 'graph',
            modal: true
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
            id: 'activate_js_instructions',
            title: 'tutorial.activate_js.title',
            description: 'tutorial.activate_js.description',
            view: 'snap',
            modal: true
        },
        {
            id: 'import_data_instructions',
            title: 'tutorial.import_data.title',
            description: 'tutorial.import_data.description',
            view: 'snap',
            modal: true

        },
        {
            id: 'edit_snap',
            title: 'tutorial.edit_snap.title',
            description: 'tutorial.edit_snap.description',
            view: 'snap',
            modal: true
        },
        {
            id: 'post_to_smerge',
            title: 'tutorial.post_to_smerge.title',
            description: 'tutorial.post_to_smerge.description',
            view: 'snap',
            modal: true
        }, {
            id: 'back_to_project',
            title: 'tutorial.back_to_project.title',
            description: 'tutorial.back_to_project.description',
            view: 'snap',
            modal: true
        }, {
            id: 'view_new_node',
            title: 'tutorial.view_new_node.title',
            description: 'tutorial.view_new_node.description',
            view: 'graph',
            modal: true
        }, {
            id: 'merge_intro',
            title: 'tutorial.merge_intro.title',
            description: 'tutorial.merge_intro.description',
            view: 'graph',
            modal: true
        },
        {
            id: 'merge_select',
            title: 'tutorial.merge_select.title',
            description: 'tutorial.merge_select.description',
            view: 'graph',
            target: {
                // TODO sinvoller Selector!
                type: 'dom',
                selector: '.__________cytoscape_container > div:nth-child(2) .commitmessage'
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
