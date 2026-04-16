import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import "jheat.js/dist/heat.js.css";
import "jheat.js";

declare global {
    interface Window {
        $heat: any;
    }
}

interface ActivityHeatmapProps {
    dates: Date[];
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ dates }) => {
    const { t, i18n } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapIdRef = useRef<string | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !window.$heat) return;

        // Clean up previous instance
        if (heatmapIdRef.current) {
            try {
                window.$heat.destroy(heatmapIdRef.current);
            } catch {
                // ignore
            }
            el.innerHTML = "";
        }

        // Generate a stable unique ID
        const id = `heatmap-${Math.random().toString(36).substring(2, 10)}`;
        el.id = id;
        heatmapIdRef.current = id;

        // Compute max commits per day to configure relative color ranges
        const countsPerDay: Record<string, number> = {};
        for (const d of dates) {
            const key = d.toISOString().slice(0, 10);
            countsPerDay[key] = (countsPerDay[key] ?? 0) + 1;
        }
        const maxPerDay = Math.max(1, ...Object.values(countsPerDay));

        // Render heatmap with options
        window.$heat.render(el, {
            title: {
                text: t("ProjectStatsPage.heatmapTitle"),
                showConfigurationButton: false,
            },
            views: {
                map: {
                    showDayNames: true,
                    showMonthNames: true,
                },
            },
            toolbar: {
                showNavigationButtons: true,
            },
            dynamicColorRange: {
                enabled: true,
                startMinimum: 1,
                maximumMinimum: maxPerDay,
                totalColors: Math.min(maxPerDay, 5),
            },
        });

        // Add all commit dates
        if (dates.length > 0) {
            window.$heat.addDates(id, dates, "Commits", true);
        }

        return () => {
            if (heatmapIdRef.current && window.$heat) {
                try {
                    window.$heat.destroy(heatmapIdRef.current);
                } catch {
                    // ignore
                }
            }
            if (el) el.innerHTML = "";
            heatmapIdRef.current = null;
        };
    }, [dates, i18n.language]);

    return (
        <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t("ProjectStatsPage.heatmapTitle")}
            </Typography>
            <Box
                ref={containerRef}
                sx={{
                    overflowX: "auto",
                    "& .heat-js": {
                        borderRadius: "8px",
                    },
                }}
            />
        </Box>
    );
};

export default ActivityHeatmap;
