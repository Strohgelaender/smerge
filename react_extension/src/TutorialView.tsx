import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { TutorialManager } from "./components/Tutorial/TutorialManager";
import { lightPageContainer } from "./pages/publicPageStyles.ts";
import { createTutorialProject } from "./services/TutorialService";
import { useNavigate } from "react-router-dom";
import ProjectView from "./ProjectView.tsx";
import { TUTORIAL_SEQUENCES } from "./config/tutorialSequences";
import { File } from "./services/ApiService";
import httpService from "./services/HttpService";

const TUTORIAL_SEQUENCE_ID = "smerge-tutorial";

const TutorialView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);

  // Snap-State
  const [snapFileName, setSnapFileName] = useState<string | null>(null);
  const [snapReady, setSnapReady] = useState(false);
  const snapFrameRef = useRef<HTMLIFrameElement | null>(null);
  const snapTaskHookedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const tutorialSequence = TUTORIAL_SEQUENCES[TUTORIAL_SEQUENCE_ID];

  const currentStep = isActive
    ? tutorialSequence?.steps[currentStepIndex] ?? null
    : null;
  const isLastStep = isActive && !!tutorialSequence && currentStepIndex >= tutorialSequence.steps.length - 1;

  const progress = {
    current: isActive && tutorialSequence ? currentStepIndex + 1 : 0,
    total: tutorialSequence?.steps.length ?? 0,
  };

  const viewMode = isActive ? (currentStep?.view ?? "graph") : "graph";

  // TODO reduce duplication (url constant)!
  const snapSrc = useMemo(() => {
    if (!snapFileName) return null;
    return `https://snap.berkeley.edu/snap/snap.html#open:${httpService.baseURL}/action/blockerXML/${snapFileName}`;
  }, [snapFileName]);

  const startTutorial = () => {
    if (!tutorialSequence) {
      console.error(`Tutorial sequence not found: ${TUTORIAL_SEQUENCE_ID}`);
      return;
    }

    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const completeTutorial = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setSnapReady(false);
    snapTaskHookedRef.current = false;
    // Zurück zur Homepage
    navigate("/");
  };

  const nextStep = () => {
    if (!tutorialSequence) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= tutorialSequence.steps.length) {
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

          const files = await httpService.getAsync<File[]>(
            `/api/project/${result.project_id}/files`
          );
          const tutorialFile = files.find((f) => f.id === result.file_id) ?? files[0];
          if (tutorialFile?.file_url) {
            setSnapFileName(tutorialFile.file_url.replace('/media/', ''));
          }

          setLoading(false);

          // Start tutorial after a short delay to ensure ProjectView loads
          setTimeout(() => {
            startTutorial();
          }, 500);
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
  function handleNodeDoubleClick(nodeId: string) {
    console.log("Tutorial: Node double-clicked:", nodeId, currentStep);

    // TODO TODD TODO
    // if (currentStep?.id === "open_snap") {
      snapTaskHookedRef.current = false;
      setSnapReady(false);
      // setViewMode("snap");
      setCurrentStepIndex(3);
      // }
  }

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

  const tutorialRoot = document.getElementById("tutorial-root");

  // Render via Portal in das separate tutorial-root Element
  // Dies verhindert, dass das Modal das Layout der Haupt-App beeinflusst
  return projectId && (
    <Box sx={{ position: "relative", width: "100%", height: "100vh" }}>
      {tutorialRoot && createPortal(
        <TutorialManager
          isActive={isActive}
          currentStep={currentStep}
          progress={progress}
          isLastStep={isLastStep}
          onNextStep={nextStep}
          onCloseTutorial={completeTutorial}
          onNodeDoubleClick={handleNodeDoubleClick}
        />,
        tutorialRoot
      )}

      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {viewMode === "graph" && (
          <ProjectView
            projectId={projectId}
            fileId={fileId}
            embedded={true}
            onNodeDoubleClick={handleNodeDoubleClick}
          />
        )}

        {viewMode === "snap" && snapSrc && (
          <>
            {!snapReady && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10002,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <CircularProgress size={48} />
                <Typography variant="body1" sx={{ color: "black" }}>
                  Loading Snap editor...
                </Typography>
              </Box>
            )}
            <iframe
              ref={snapFrameRef}
              src={snapSrc}
              title="Tutorial Snap Editor"
              onLoad={() => setSnapReady(true)}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                backgroundColor: "white",
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default TutorialView;

