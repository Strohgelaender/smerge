import React, { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { TutorialManager } from "./components/Tutorial/TutorialManager";
import { lightPageContainer } from "./pages/publicPageStyles.ts";
import { createTutorialProject } from "./services/TutorialService";
import { useNavigate } from "react-router-dom";
import ProjectView from "./ProjectView.tsx";
import { TUTORIAL_SEQUENCES } from "./config/tutorialSequences";

const TUTORIAL_SEQUENCE_ID = "smerge-tutorial";

const TutorialView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSequenceId, setCurrentSequenceId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentSequence = useMemo(() => {
    if (!currentSequenceId) return null;
    return TUTORIAL_SEQUENCES[currentSequenceId] ?? null;
  }, [currentSequenceId]);

  const currentStep = currentSequence?.steps[currentStepIndex] ?? null;
  const isLastStep = currentSequence
    ? currentStepIndex >= currentSequence.steps.length - 1
    : false;
  const progress = {
    current: currentSequence ? currentStepIndex + 1 : 0,
    total: currentSequence ? currentSequence.steps.length : 0,
  };

  const startTutorial = (sequenceId: string) => {
    const sequence = TUTORIAL_SEQUENCES[sequenceId];
    if (!sequence) return;
    setCurrentSequenceId(sequenceId);
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const completeTutorial = () => {
    setIsActive(false);
    setCurrentSequenceId(null);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    if (!currentSequence) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= currentSequence.steps.length) {
      completeTutorial();
      return;
    }
    setCurrentStepIndex(nextIndex);
  };

  // Tutorial starten
  useEffect(() => {
    const initTutorial = async () => {
      try {
        const result = await createTutorialProject();

        if (result && result.success) {
          setProjectId(result.project_id);
          setFileId(result.file_id);
          setLoading(false);

          // Start tutorial after a short delay to ensure ProjectView loads
          setTimeout(() => {
            startTutorial(TUTORIAL_SEQUENCE_ID);
          }, 1500);
        } else {
          setError("Failed to create tutorial project");
          setLoading(false);
        }
      } catch (err) {
        console.error("Tutorial initialization error:", err);
        setError("An error occurred while initializing the tutorial");
        setLoading(false);
      }
    };

    initTutorial();
  }, []);

  // Klick auf Projekt-Node intercepten und im Tutorial weiter machen
  const handleNodeDoubleClick = (nodeId: string) => {
    console.log("Tutorial: Node double-clicked:", nodeId);

    // TODO auch das sollte objekt-orientiert Teil der Sequence sein (handler function?)
    if (currentStep?.id === "open_snap") {
      nextStep();
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          ...lightPageContainer,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Preparing tutorial environment...</Typography>
      </Box>
    );
  }

  if (error || !projectId || !fileId) {
    return (
      <Box sx={{ ...lightPageContainer, p: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || "Failed to load tutorial"}
        </Typography>
        <Typography>
          Please try again or return to the{" "}
          <a href="/" onClick={() => navigate("/")}>
            homepage
          </a>
          .
        </Typography>
      </Box>
    );
  }

  return projectId && (
    <Box sx={{ position: "relative", width: "100%", height: "100vh" }}>
      <TutorialManager
        isActive={isActive}
        currentStep={currentStep}
        progress={progress}
        isLastStep={isLastStep}
        onNextStep={nextStep}
        onCloseTutorial={completeTutorial}
        onNodeDoubleClick={handleNodeDoubleClick}
      />

      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <ProjectView
          projectId={projectId}
          fileId={fileId}
          embedded={true}
          onNodeDoubleClick={handleNodeDoubleClick}
        />
      </Box>
    </Box>
  );
};

export default TutorialView;

