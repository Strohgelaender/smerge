import {Box, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Footer from "../components/shared/Footer";
import homeIcon from "../assets/home-icon.svg";
import homeIconDebug from "../assets/home-icon-debug.svg";
import "./Base.css";
import "./Home.css";
import {primaryButtonSx} from "./publicPageStyles.ts";

interface SettingsData {
    inBeta: boolean;
    devAdd: string;
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [settings, setSettings] = useState<SettingsData>({inBeta: false, devAdd: ""});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // For now, use hardcoded settings from build env
                // Later we'll create an API endpoint for this
                const inBeta = import.meta.env.VITE_IN_BETA === "true";
                const devAdd = import.meta.env.VITE_DEV_ADD || "";
                setSettings({inBeta, devAdd});
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleOpenProject = () => {
        navigate("/open");
    };

    const handleCreateProject = () => {
        navigate("/create");
    };

    const handleStartTutorial = () => {
        navigate("/tutorial");
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box
            sx={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                color: "black",
            }}
        >
            <Box className="vertical-center" sx={{textAlign: "center"}}>
                <Box sx={{marginBottom: "2em"}}>
                    {settings.inBeta ? (
                        <Box className={"imageStack"}>
                            <img
                                src={homeIconDebug}
                                alt="SMERGE Beta"
                                style={{
                                    width: "75%",
                                    height: "auto",
                                }}
                            />
                            <Box component="h1" className={"betaSign"}>
                                <span>B</span>
                                <span>E</span>
                                <span>T</span>
                                <span>A</span>
                            </Box>
                        </Box>
                    ) : (
                        <img
                            src={homeIcon}
                            alt="SMERGE"
                            style={{
                                width: "75%",
                                height: "auto",
                            }}
                        />
                    )}
                </Box>

                <Box>
                    <Button
                        onClick={handleOpenProject}
                        id="open-btn"
                        className="btn"
                        variant="contained"
                        sx={{
                            ...primaryButtonSx,
                            margin: "1.5em",
                            fontSize: "15px",
                        }}
                    >
                        {t("home.open_existing")}
                    </Button>

                    <Button
                        onClick={handleCreateProject}
                        id="new-btn"
                        className="btn"
                        variant="contained"
                        sx={{
                            ...primaryButtonSx,
                            margin: "1.5em",
                            fontSize: "15px",
                        }}
                    >
                        {t("home.create_new")}
                    </Button>

                    <Button
                        onClick={handleStartTutorial}
                        id="tutorial-btn"
                        className="btn"
                        variant="outlined"
                        sx={{
                            ...primaryButtonSx,
                            margin: "1.5em",
                            fontSize: "15px",
                        }}
                    >
                        {t("home.start_tutorial")}
                    </Button>
                </Box>
            </Box>

            <Footer/>
        </Box>
    );
};

export default HomePage;
