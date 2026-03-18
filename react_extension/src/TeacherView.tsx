import {Grid, Accordion, AccordionSummary, AccordionDetails, Fab, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, IconButton} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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


const TeacherView: React.FC = () => {

    const [projectsOfSchoolclasses, setProjectsOfSchoolclasses] = useState<{
        schoolclass: SchoolclassDto,
        projects: ProjectDto[]
    }[]>([]);

    const [isLoading, setLoading] = useState<boolean>(true)

    const [editingSchoolclassId, setEditingSchoolclassId] = useState<string | null>(null);
    const [editingSchoolclassName, setEditingSchoolclassName] = useState<string>("");
    const [isSavingSchoolclass, setIsSavingSchoolclass] = useState<boolean>(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
    const [schoolclassToDelete, setSchoolclassToDelete] = useState<{schoolclass: SchoolclassDto, projects: ProjectDto[]} | null>(null);
    const [isDeletingSchoolclass, setIsDeletingSchoolclass] = useState<boolean>(false);


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


    function addProjectToState(project: ProjectDto) {
        const stateCopy = projectsOfSchoolclasses;
        const schoolClassIndex = projectsOfSchoolclasses.findIndex(item => item.schoolclass.id == project.schoolclass);
        stateCopy[schoolClassIndex].projects = stateCopy[schoolClassIndex].projects.concat([project]);
        setProjectsOfSchoolclasses(stateCopy);
    }

    function deleteProjectFromState(project: ProjectDto) {
        const stateCopy = projectsOfSchoolclasses;
        const schoolClassIndex = projectsOfSchoolclasses.findIndex(item => item.schoolclass.id == project.schoolclass);
        stateCopy[schoolClassIndex].projects = stateCopy[schoolClassIndex].projects.filter(item => item.id != project.id);
        setProjectsOfSchoolclasses(stateCopy);
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!projectsOfSchoolclasses?.length) {
        return <div>You do not have any Schoolclasses yet, create one on the bottom right!</div>;
    }
    return <div>
        {projectsOfSchoolclasses.map((item: {
            schoolclass: SchoolclassDto,
            projects: ProjectDto[]
        }, index: number) => {
            const isEditingThisClass = editingSchoolclassId === item.schoolclass.id;

            return <Accordion expanded={index === 0} key={item.schoolclass.id}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
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
                        <Box sx={{display: 'flex', gap: 0.5, ml: 2}} onClick={(e) => e.stopPropagation()}>
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
                        <Grid item key={'importButton'}>
                            <AddProjectDialog addProjectToState={addProjectToState}
                                              schoolClass={item.schoolclass}></AddProjectDialog>
                        </Grid>
                        <Grid item key={'addButton'}>
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
}

export default TeacherView;
