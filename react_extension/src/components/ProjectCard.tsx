import { Card, CardActions, CardContent, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProjectDto from "./models/ProjectDto";
import ProjectCardContextMenu from "./ProjectCardContextMenu";
import { putProjectNameChange } from "../services/ProjectService";

const ProjectCard = (props: {
    projectData: ProjectDto,
    addProjectToState: (arg0: ProjectDto) => void,
    deleteProjectFromState: (project: ProjectDto) => void,
    renameProjectInState: (projectId: string, name: string) => void
}) => {

    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [draftName, setDraftName] = useState<string>(props.projectData.name);
    const [isSavingName, setIsSavingName] = useState<boolean>(false);

    useEffect(() => {
        setDraftName(props.projectData.name);
    }, [props.projectData.name]);

    const handleButtonClick = () => {
        location.href = location.href.replace('ext/teacher_view', `ext/project_view/${props.projectData.id}`);
    };

    const startEditingName = () => {
        setDraftName(props.projectData.name);
        setIsEditingName(true);
    };

    const cancelEditingName = () => {
        setDraftName(props.projectData.name);
        setIsEditingName(false);
    };

    const saveName = async () => {
        const nextName = draftName.trim();
        if (!nextName) {
            cancelEditingName();
            return;
        }

        if (nextName === props.projectData.name) {
            setIsEditingName(false);
            return;
        }

        setIsSavingName(true);
        const res = await putProjectNameChange(props.projectData.id, nextName);
        setIsSavingName(false);

        if (!res) {
            setDraftName(props.projectData.name);
            return;
        }

        props.renameProjectInState(props.projectData.id, nextName);
        setIsEditingName(false);
    };

    return (
        <Card variant="outlined" sx={{borderRadius:'10px'}}>
            <CardContent>
                {isEditingName ? (
                    <TextField
                        value={draftName}
                        size="small"
                        autoFocus
                        disabled={isSavingName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onBlur={saveName}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                saveName();
                            }
                            if (e.key === "Escape") {
                                e.preventDefault();
                                cancelEditingName();
                            }
                        }}
                    />
                ) : (
                    <Typography
                        onClick={startEditingName}
                        sx={{ cursor: "text", wordBreak: "break-word" }}
                    >
                        {props.projectData.name}
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                <ProjectCardContextMenu
                    addProjectToState={props.addProjectToState}
                    deleteProjectFromState={props.deleteProjectFromState}
                    projectData={props.projectData}
                ></ProjectCardContextMenu>
                <Button size="small" onClick={handleButtonClick}>Open Project</Button>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;