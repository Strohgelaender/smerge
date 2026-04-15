import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getProjectData } from "./services/ProjectService";
import { getCommitCountForProject, getLastCommitDateForProject, getKanbanCardCountForProject } from "./services/SchoolclassService";
import ProjectDto from "./components/models/ProjectDto";
import "./ProjectStatsPage.css";

const ProjectStatsPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [project, setProject] = useState<ProjectDto | null>(null);
    const [commitCount, setCommitCount] = useState<number>(0);
    const [lastCommitDate, setLastCommitDate] = useState<Date | null>(null);
    const [openCardCount, setOpenCardCount] = useState<number>(0);
    const [closedCardCount, setClosedCardCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        (async () => {
            try {
                const [projectData, commits, lastDate] = await Promise.all([
                    getProjectData(projectId),
                    getCommitCountForProject(projectId),
                    getLastCommitDateForProject(projectId),
                ]);
                const proj = (projectData as ProjectDto) ?? null;
                setProject(proj);
                setCommitCount(commits);
                setLastCommitDate(lastDate);

                if (proj) {
                    setOpenCardCount(getKanbanCardCountForProject(proj.kanban_board, "first"));
                    setClosedCardCount(getKanbanCardCountForProject(proj.kanban_board, "last"));
                }
            } catch (error) {
                toast.error(t("ProjectStatsPage.loadError"), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                });
            } finally {
                setIsLoading(false);
            }
        })();
    }, [projectId]);

    if (isLoading) {
        return (
            <Box className="stats-page-loading">
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>{t("ProjectStatsPage.loading")}</Typography>
            </Box>
        );
    }

    if (!project) {
        return (
            <Box className="stats-page-container">
                <Typography>{t("ProjectStatsPage.notFound")}</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    {t("ProjectStatsPage.back")}
                </Button>
            </Box>
        );
    }

    return (
        <Box className="stats-page-container">
            {/* Header */}
            <Box className="stats-page-header">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="outlined" size="small">
                    {t("ProjectStatsPage.back")}
                </Button>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {t("ProjectStatsPage.title", { name: project.name })}
                </Typography>
            </Box>

            {project.description && (
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    {project.description}
                </Typography>
            )}

            {/* Summary cards */}
            <Box className="stats-summary-grid">
                <Card variant="outlined" className="stats-summary-card">
                    <CardContent>
                        <Typography variant="overline">{t("ProjectStatsPage.commits")}</Typography>
                        <Typography variant="h4">{commitCount}</Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined" className="stats-summary-card">
                    <CardContent>
                        <Typography variant="overline">{t("ProjectStatsPage.lastCommit")}</Typography>
                        <Typography variant="h6">
                            {lastCommitDate
                                ? lastCommitDate.toLocaleString("de-DE", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "—"}
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined" className="stats-summary-card">
                    <CardContent>
                        <Typography variant="overline">{t("ProjectStatsPage.openCards")}</Typography>
                        <Typography variant="h4">{openCardCount}</Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined" className="stats-summary-card">
                    <CardContent>
                        <Typography variant="overline">{t("ProjectStatsPage.closedCards")}</Typography>
                        <Typography variant="h4">{closedCardCount}</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ProjectStatsPage;

