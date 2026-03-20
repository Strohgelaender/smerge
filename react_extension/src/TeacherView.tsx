import {Grid, Accordion, AccordionSummary, AccordionDetails, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, IconButton} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ProjectCard from "./components/ProjectCard";
import {
    getProjectsForSchoolclasses,
    getSchoolclassesOfCurrentUser,
    updateSchoolclassName,
    deleteSchoolclass
} from "./services/SchoolclassService";
import SchoolclassDto from "./components/models/SchoolclassDto";
import ProjectDto from "./components/models/ProjectDto";
import AddProjectDialog from "./components/AddProjectDialog";
import ImportProjectDialog from "./components/ImportProjectDialog";
import React, {useEffect, useState} from "react";
import AddSchoolclassDialog from "./components/AddSchoolclassDialog";
import {toast} from "react-toastify";
import { createPortal } from "react-dom";
import TutorialOverlay from "./components/Tutorial/TutorialOverlay";
import { TUTORIAL_SEQUENCES } from "./components/Tutorial/tutorialSequences";
import { getTeacherTutorialStatus, setTeacherTutorialCompleted } from "./services/TeacherAuthService";
import {useTranslation} from "react-i18next";


const TeacherView: React.FC = () => {
    const TEACHER_TUTORIAL_SEQUENCE_ID = "teacher-view-tutorial";
    const tutorialSequence = TUTORIAL_SEQUENCES[TEACHER_TUTORIAL_SEQUENCE_ID];

    const [isTutorialActive, setIsTutorialActive] = useState<boolean>(false);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

    const [projectsOfSchoolclasses, setProjectsOfSchoolclasses] = useState<{
        schoolclass: SchoolclassDto,
        projects: ProjectDto[]
    }[]>([]);

    const [isLoading, setLoading] = useState<boolean>(true)

    // Class name editing state
    const [editingSchoolclassId, setEditingSchoolclassId] = useState<string | null>(null);
    const [editingSchoolclassName, setEditingSchoolclassName] = useState<string>("");
    const [isSavingSchoolclass, setIsSavingSchoolclass] = useState<boolean>(false);

    // Class delete state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
    const [schoolclassToDelete, setSchoolclassToDelete] = useState<{schoolclass: SchoolclassDto, projects: ProjectDto[]} | null>(null);
    const [isDeletingSchoolclass, setIsDeletingSchoolclass] = useState<boolean>(false);

    const currentStep = isTutorialActive
        ? tutorialSequence?.steps[currentStepIndex] ?? null
        : null;
    const isLastStep = isTutorialActive && !!tutorialSequence && currentStepIndex >= tutorialSequence.steps.length - 1;
    const progress = {
        current: isTutorialActive && tutorialSequence ? currentStepIndex + 1 : 0,
        total: tutorialSequence?.steps.length ?? 0,
    };

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const schoolclassesOfUser = await getSchoolclassesOfCurrentUser();
                const state = await getProjectsForSchoolclasses(schoolclassesOfUser);
                setProjectsOfSchoolclasses(state);
                setLoading(false);
                console.log(projectsOfSchoolclasses);
            } catch (error) {
                toast.error('Could not load data!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                });
                setProjectsOfSchoolclasses([]);
            }
        })();
    }, []);

    async function loadTutorialState() {
        try {
            const tutorialStatus = await getTeacherTutorialStatus();
            if (!tutorialStatus.completed_tutorial) {
                setCurrentStepIndex(0);
                setIsTutorialActive(true);
            }
        } catch (error) {
            console.error("Could not load teacher tutorial status", error);
        }
    }

    useEffect(() => {
        if (isLoading || !tutorialSequence) {
            return;
        }
        loadTutorialState();
    }, [isLoading, tutorialSequence]);


    function addProjectToState(project: ProjectDto) {
        // Fügt das Projekt dem korrekten Array hinzu.
        // Die Syntax ist so komplex, damit so zuverlässig die React Change-Detection getriggerd wird.
        setProjectsOfSchoolclasses((prev) =>
            prev.map((entry) =>
                entry.schoolclass.id === project.schoolclass
                    ? { ...entry, projects: [...entry.projects, project] }
                    : entry
            )
        );
    }

    function deleteProjectFromState(project: ProjectDto) {
        setProjectsOfSchoolclasses((prev) =>
            prev.map((entry) =>
                entry.schoolclass.id === project.schoolclass
                    ? { ...entry, projects: entry.projects.filter((p) => p.id !== project.id) }
                    : entry
            )
        );
    }

    function renameProjectInState(projectId: string, name: string) {
        setProjectsOfSchoolclasses((prev) =>
            prev.map((entry) => ({
                ...entry,
                projects: entry.projects.map((project) => {
                        if (project.id === projectId) {
                            return {...project, name: name};
                        }
                        return project;
                    }
                ),
            }))
        );
    }

    const startEditingSchoolclass = (schoolclass: SchoolclassDto) => {
        setEditingSchoolclassId(schoolclass.id);
        setEditingSchoolclassName(schoolclass.name);
    };

    const cancelEditingSchoolclass = () => {
        setEditingSchoolclassId(null);
        setEditingSchoolclassName("");
    };

    const saveSchoolclassName = async () => {
        const nextName = editingSchoolclassName.trim();
        if (!nextName) {
            cancelEditingSchoolclass();
            return;
        }

        setIsSavingSchoolclass(true);
        const res = await updateSchoolclassName(editingSchoolclassId!, nextName);
        setIsSavingSchoolclass(false);

        if (!res) {
            toast.error("Failed to update schoolclass name.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            });
            return;
        }

        // Update state
        setProjectsOfSchoolclasses((prev) =>
            prev.map((entry) =>
                entry.schoolclass.id === editingSchoolclassId
                    ? { ...entry, schoolclass: { ...entry.schoolclass, name: nextName } }
                    : entry
            )
        );

        toast.success("Schoolclass renamed.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
        });

        cancelEditingSchoolclass();
    };

    // Schoolclass delete functions
    const openDeleteConfirm = (entry: {schoolclass: SchoolclassDto, projects: ProjectDto[]}) => {
        setSchoolclassToDelete(entry);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteSchoolclass = async () => {
        if (!schoolclassToDelete) return;

        setIsDeletingSchoolclass(true);
        const res = await deleteSchoolclass(schoolclassToDelete.schoolclass.id);
        setIsDeletingSchoolclass(false);

        if (!res) {
            toast.error("Failed to delete schoolclass.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            });
            return;
        }

        // Update state
        setProjectsOfSchoolclasses((prev) =>
            prev.filter((entry) => entry.schoolclass.id !== schoolclassToDelete.schoolclass.id)
        );

        toast.success("Schoolclass deleted.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
        });

        setDeleteConfirmOpen(false);
        setSchoolclassToDelete(null);
    };

    async function closeTutorial() {
        setIsTutorialActive(false);
        setCurrentStepIndex(0);

        try {
            await setTeacherTutorialCompleted(true);
        } catch (error) {
            console.error("Could not persist teacher tutorial status", error);
        }
    }

    function nextTutorialStep() {
        if (!tutorialSequence) {
            return;
        }

        const nextStepIndex = currentStepIndex + 1;
        if (nextStepIndex >= tutorialSequence.steps.length) {
            closeTutorial();
            return;
        }

        setCurrentStepIndex(nextStepIndex);
    }

    function restartTeacherTutorial() {
        setCurrentStepIndex(0);
        setIsTutorialActive(true);
    }

    const tutorialRoot = document.getElementById("tutorial-root");

    const restartTutorialButton = (
        <Box sx={{ position: "fixed", left: 16, bottom: 16, zIndex: 1300 }}>
            <Button
                variant="contained"
                size="small"
                startIcon={<RestartAltIcon />}
                onClick={restartTeacherTutorial}
            >
                {t('TeacherView.restartTutorial')}
            </Button>
        </Box>
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!projectsOfSchoolclasses?.length) {
        return <>
            {tutorialRoot && isTutorialActive && currentStep && createPortal(
                <TutorialOverlay
                    step={currentStep}
                    progress={progress}
                    isLastStep={isLastStep}
                    onNext={nextTutorialStep}
                    onClose={closeTutorial}
                />,
                tutorialRoot
            )}
            {!isTutorialActive && restartTutorialButton}
            <div>
                You do not have any Schoolclasses yet, create one on the bottom right!
                <AddSchoolclassDialog state={projectsOfSchoolclasses}
                                      setState={setProjectsOfSchoolclasses}></AddSchoolclassDialog>
            </div>
        </>;
    }
    return <>
        {tutorialRoot && isTutorialActive && currentStep && createPortal(
            <TutorialOverlay
                step={currentStep}
                progress={progress}
                isLastStep={isLastStep}
                onNext={nextTutorialStep}
                onClose={closeTutorial}
            />,
            tutorialRoot
        )}
        {!isTutorialActive && restartTutorialButton}
        <div>
        {projectsOfSchoolclasses.map((item: {
            schoolclass: SchoolclassDto,
            projects: ProjectDto[]
        }) => {
            const isEditingThisClass = editingSchoolclassId === item.schoolclass.id;

            return <Accordion key={item.schoolclass.id}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    {/* Editable Class name */}
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flex: 1}}>
                        {isEditingThisClass ? (
                            <TextField
                                value={editingSchoolclassName}
                                size="small"
                                autoFocus
                                disabled={isSavingSchoolclass}
                                onChange={(e) => setEditingSchoolclassName(e.target.value)}
                                onBlur={saveSchoolclassName}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        saveSchoolclassName();
                                    }
                                    if (e.key === "Escape") {
                                        e.preventDefault();
                                        cancelEditingSchoolclass();
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                sx={{flex: 1}}
                            />
                        ) : (
                            <span>{item.schoolclass.name}</span>
                        )}
                    </Box>
                    {!isEditingThisClass && (
                        <Box sx={{display: 'flex', gap: 0.5, ml: 2}}>
                            <IconButton
                                size="small"
                                onClick={() => startEditingSchoolclass(item.schoolclass)}
                            >
                                <EditIcon fontSize="small"/>
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => openDeleteConfirm(item)}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                    )}
                </AccordionSummary>
                <AccordionDetails>
                    {/* All projects of this class */}
                    <Grid container spacing="10" alignItems="center" key={item.schoolclass.id}>
                        {
                            item.projects.map((projectsItem: ProjectDto) => {
                                return <Grid item key={projectsItem.id}>
                                    <ProjectCard
                                        addProjectToState={addProjectToState}
                                        deleteProjectFromState={deleteProjectFromState}
                                        renameProjectInState={renameProjectInState}
                                        projectData={projectsItem}
                                    ></ProjectCard>
                                </Grid>
                            })
                        }
                        <Grid item key={'addButton'}>
                            <AddProjectDialog addProjectToState={addProjectToState}
                                              schoolClass={item.schoolclass}></AddProjectDialog>
                        </Grid>
                        <Grid item key={'importButton'}>
                            <ImportProjectDialog addProjectToState={addProjectToState}
                                                 schoolClass={item.schoolclass}></ImportProjectDialog>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        })
        }

        {/* Delete Schoolclass Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
            <DialogTitle>Delete Schoolclass</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the schoolclass
                    "<strong>{schoolclassToDelete?.schoolclass.name}</strong>"? <br/>
                    This will remove <strong>{schoolclassToDelete?.projects.length || 0} project(s)</strong> associated
                    with this class.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                <Button
                    onClick={confirmDeleteSchoolclass}
                    color="error"
                    variant="contained"
                    disabled={isDeletingSchoolclass}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>

        <AddSchoolclassDialog state={projectsOfSchoolclasses}
                              setState={setProjectsOfSchoolclasses}></AddSchoolclassDialog>
    </div>
    </>
}

export default TeacherView;
