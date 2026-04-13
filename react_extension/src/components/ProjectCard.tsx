import { Card, CardActions, CardContent, TextField, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ProjectDto from "./models/ProjectDto";
import ProjectCardContextMenu from "./ProjectCardContextMenu";
import { putProjectNameChange } from "../services/ProjectService";



const lastCommitIcon = "most-recent.svg";
const numberCommitIcon = "commit-icon.svg";



// Helper function to get icon URL - same pattern as KanbanBoard
const getIconUrl = (iconName: string) => {
    // All icons are in /static/icons/
    return `/static/icons/${iconName}`;
};

interface ProjectCardProps {
    projectData: ProjectDto,
    addProjectToState: (arg0: ProjectDto) => void,
    deleteProjectFromState: (project: ProjectDto) => void,
    renameProjectInState: (projectId: string, name: string) => void,
    commitCount?: number,
    lastCommitDate?: Date | null,
}

const ProjectCard: FC<ProjectCardProps> = (props) => {

    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [draftName, setDraftName] = useState<string>(props.projectData.name);
    const [isSavingName, setIsSavingName] = useState<boolean>(false);
    const [isPinVisible, setIsPinVisible] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        setDraftName(props.projectData.name);
    }, [props.projectData.name]);

    const handleButtonClick = () => {
        const projectUrl = window.location.origin + `/project_view/${props.projectData.id}`;
        window.open(projectUrl, '_blank');
    };

    const startEditingName = () => {
        setDraftName(props.projectData.name);
        setIsEditingName(true);
    };

    const cancelEditingName = () => {
        setDraftName(props.projectData.name);
        setIsEditingName(false);
    };

    const handleCopyPin = () => {
        navigator.clipboard.writeText(props.projectData.pin).then(_ => {
            toast.success(t('ProjectCard.pin_copied'), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            });
        });
    };

    const getMaskedPin = () => {
        return "*".repeat(props.projectData.pin.length);
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
        <Card variant="outlined" sx={{borderRadius:'10px', minHeight: '220px', minWidth: '280px', display: 'flex', flexDirection: 'column', p: 1.5}}>
            <CardContent sx={{flex: 1, pb: 1}}>
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
                    <>
                        <Typography
                            onClick={startEditingName}
                            sx={{ cursor: "text", wordBreak: "break-word", fontSize: '1.1rem', fontWeight: 600, mb: 1 }}
                        >
                            {props.projectData.name}
                        </Typography>
                        {props.commitCount !== undefined && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1, mb: 0.5 }}>
                                <img
                                    src={getIconUrl(numberCommitIcon)}
                                    alt="commits"
                                    style={{ width: '1.8em', height: '1.8em', display: 'inline-block', flexShrink: 0 }}
                                />
                                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: '0.95rem' }}>
                                    Commits: {props.commitCount}
                                </Typography>
                            </Box>
                        )}
                        {props.lastCommitDate !== undefined && props.lastCommitDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                                <img
                                    src={getIconUrl(lastCommitIcon)}
                                    alt="last commit"
                                    style={{ width: '1.8em', height: '1.8em', display: 'inline-block', flexShrink: 0 }}
                                />
                                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: '0.95rem' }}>
                                    Last Commit: {props.lastCommitDate.toLocaleString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </CardContent>
            <CardActions sx={{mt: 'auto', pt: 0}}>
                <ProjectCardContextMenu
                    addProjectToState={props.addProjectToState}
                    deleteProjectFromState={props.deleteProjectFromState}
                    projectData={props.projectData}
                ></ProjectCardContextMenu>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, ml: "auto" }}>
                    {/* PIN-Anzeige */}
                    <Typography variant="caption" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        {isPinVisible ? props.projectData.pin : getMaskedPin()}
                    </Typography>
                    <Tooltip title={isPinVisible ? t('ProjectCard.hide_pin') : t('ProjectCard.show_pin')}>
                        <IconButton
                            size="small"
                            onClick={() => setIsPinVisible(!isPinVisible)}
                            sx={{ p: "2px" }}
                        >
                            {isPinVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('ProjectCard.copy_pin')}>
                        <IconButton
                            size="small"
                            onClick={handleCopyPin}
                            sx={{ p: "2px" }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Projekt in einem neuen Tab öffnen */}
                    <Tooltip title={t('ProjectCard.open_project')}>
                        <IconButton
                            size="small"
                            onClick={handleButtonClick}
                            sx={{ p: "2px" }}
                        >
                            <OpenInNewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;