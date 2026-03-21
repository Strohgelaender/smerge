import {TutorialSequence} from "./tutorial.ts";

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
            title: 'tutorial.student_steps.welcome.title',
            description: 'tutorial.student_steps.welcome.description',
            mode: 'modal'
        },
        {
            id: 'explain_overview',
            title: 'tutorial.student_steps.overview.title',
            description: 'tutorial.student_steps.overview.description',
            mode: 'modal'
        },
        {
            id: 'open_snap',
            title: 'tutorial.student_steps.open_snap.title',
            description: 'tutorial.student_steps.open_snap.description',
            target: {
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
            title: 'tutorial.student_steps.activate_js.title',
            description: 'tutorial.student_steps.activate_js.description',
            mode: 'modal'
        },
        {
            id: 'import_data_instructions',
            title: 'tutorial.student_steps.import_data.title',
            description: 'tutorial.student_steps.import_data.description',
            mode: 'modal'
        },
        {
            id: 'edit_snap',
            title: 'tutorial.student_steps.edit_snap.title',
            description: 'tutorial.student_steps.edit_snap.description',
            mode: 'modal'
        },
        {
            id: 'edit_small',
            mode: 'small'
        },
        {
            id: 'post_to_smerge',
            title: 'tutorial.student_steps.post_to_smerge.title',
            description: 'tutorial.student_steps.post_to_smerge.description',
            mode: 'modal'
        },
        {
            id: 'post_small',
            mode: 'small'
        },
        {
            id: 'back_to_project',
            title: 'tutorial.student_steps.back_to_project.title',
            description: 'tutorial.student_steps.back_to_project.description',
            mode: 'modal'
        }, {
            id: 'view_new_node',
            title: 'tutorial.student_steps.view_new_node.title',
            description: 'tutorial.student_steps.view_new_node.description',
            mode: 'modal'
        }, {
            id: 'merge_intro',
            title: 'tutorial.student_steps.merge_intro.title',
            description: 'tutorial.student_steps.merge_intro.description',
            mode: 'modal'
        },
        {
            id: 'merge_select',
            title: 'tutorial.student_steps.merge_select.title',
            description: 'tutorial.student_steps.merge_select.description',
            target: {
                selector: '.__________cytoscape_container > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > div:nth-child(1) .commitmessage',
                position: 'top'
            },
            validation: {
                type: 'click'
            }
        }, {
            id: 'merge_click',
            title: 'tutorial.student_steps.merge_click.title',
            description: 'tutorial.student_steps.merge_click.description',
            target: {
                selector: '#mergeButton',
                position: 'top-left'
            },
            validation: {
                type: 'click'
            }
        },
        {
            id: 'completion',
            title: 'tutorial.student_steps.completion.title',
            description: 'tutorial.student_steps.completion.description',
            mode: 'modal'
        }
    ]
};

export const TEACHER_VIEW_TUTORIAL: TutorialSequence = {
    id: 'teacher-view-tutorial',
    name: 'tutorial.teacher_view.name',
    steps: [
        {
            id: 'teacher_welcome',
            title: 'tutorial.teacher_view.welcome.title',
            description: 'tutorial.teacher_view.welcome.description',
            mode: 'modal'
        },
        {
            id: 'explain_add_class_button',
            title: 'tutorial.teacher_view.add_class_button.title',
            description: 'tutorial.teacher_view.add_class_button.description',
            target: {
                selector: '#add-schoolclass-fab',
                position: 'top-left'
            },
            validation: {
                type: 'click'
            }
        }, {
            id: 'expand_class',
            title: 'tutorial.teacher_view.expand_class.title',
            description: 'tutorial.teacher_view.expand_class.description',
            target: {
                selector: '.schoolclass-accordion',
                position: 'bottom'
            },
            validation: {
                type: 'click'
            }
        }, {
            id: 'add_project',
            title: 'tutorial.teacher_view.add_project.title',
            description: 'tutorial.teacher_view.add_project.description',
            target: {
                selector: '.addProjectButton',
                position: 'bottom'
            },
            validation: {
                type: 'click'
            }
        },
        {
            id: 'add_project_details',
            title: 'tutorial.teacher_view.add_project_details.title',
            description: 'tutorial.teacher_view.add_project_details.description',
            target: {
                selector: '#addProjectTitle',
                position: 'top'
            },
            validation: {
                type: 'click'
            }
        },
        {
            id: 'manage_projects',
            title: 'tutorial.teacher_view.manage_projects.title',
            description: 'tutorial.teacher_view.manage_projects.description',
            mode: 'modal'
        },
        {
            id: 'project_pin_explainer',
            title: 'tutorial.teacher_view.project_pin_explainer.title',
            description: 'tutorial.teacher_view.project_pin_explainer.description',
            mode: 'modal'
        }, {
            id: 'teacher_completion',
            title: 'tutorial.teacher_view.teacher_completion.title',
            description: 'tutorial.teacher_view.teacher_completion.description',
            mode: 'modal'
        }
    ]
};

/**
 * Alle verfügbaren tutorial-sequences.
 * Füge neue Tutorials hier ein.
 */
export const TUTORIAL_SEQUENCES: Record<string, TutorialSequence> = {
    'smerge-tutorial': SMERGE_TUTORIAL,
    'teacher-view-tutorial': TEACHER_VIEW_TUTORIAL
};
