import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { TutorialStep } from '../../types/tutorial';
import { createPortal } from 'react-dom';

interface TutorialOverlayProps {
  step: TutorialStep;
  progress: { current: number; total: number };
  isLastStep: boolean;
  onNext: () => void;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  step,
  progress,
  isLastStep,
  onNext,
  onClose,
}) => {
  const { t } = useTranslation();
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // useEffect für Target-Position
  useEffect(() => {
    const findTarget = () => {
      let target: HTMLElement | null = null;

      if (step.target.type === 'dom') {
        target = document.querySelector(step.target.selector);
      } // TODO weitere selectors

      console.log("found target for step", step.id, target);

      if (target) {
        const rect = target.getBoundingClientRect();
        const position = step.target.position || 'top';

        let top = rect.top;
        let left = rect.left + rect.width / 2;

        switch (position) {
          case 'bottom':
            top = rect.bottom + 20;
            break;
          case 'top':
            top = rect.top - 20;
            break;
          case 'left':
            left = rect.left - 20;
            top = rect.top + rect.height / 2;
            break;
          case 'right':
            left = rect.right + 20;
            top = rect.top + rect.height / 2;
            break;
        }

        console.log("calculated coords for step", step.id, { top, left, width: rect.width, height: rect.height });

        setCoords({ top, left, width: rect.width, height: rect.height });
      }
    };

    findTarget();
    const timeout = setTimeout(findTarget, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [step]);

  const getTooltipStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10000,
    };

    if (step.actions?.modal) {
      // Centered modal
      return {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    // Relative position der Tutorial-Box zum Target
    const position = step.target.position || 'top';
    const style = { ...baseStyle, top: coords.top, left: coords.left };
    switch (position) {
      case 'bottom':
        return {
          ...style,
          transform: 'translateX(-50%)',
        };
      case 'top':
        return {
          ...style,
          transform: 'translate(-50%, -100%)',
        };
      case 'left':
        return {
          ...style,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          ...style,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          ...style,
          transform: 'translate(-50%, -100%)',
        };
    }
  };

  const modalRoot = document.getElementById('tutorial-root');

  if (!modalRoot) {
    return null;
  }

  const content = (
    <>
      {!step.actions?.modal && (
        <>
          {step.actions?.highlight && coords.width > 0 && coords.height > 0 && (
            <Box
              sx={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                height: coords.height,
                border: '2px solid #076AAB',
                borderRadius: '6px',
                boxShadow: '0 0 18px 4px rgba(7, 106, 171, 0.75)',
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            />
          )}
        </>
      )}

      {/* Tooltip/Modal */}
      <Paper
        ref={tooltipRef}
        elevation={8}
        sx={{
          ...getTooltipStyle(),
          maxWidth: 400,
          p: 3,
          backgroundColor: 'white',
          border: '2px solid #076AAB',
        }}
      >
        {/* Close button */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: "black"}}
        >
          <CloseIcon />
        </IconButton>

        {/* Progress indicator */}
        <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block', color: "black" }}>
          {t('tutorial.step')} {progress.current} / {progress.total}
        </Typography>

        <Typography variant="h6" sx={{ mb: 1, pr: 4, color: "black" }}>
          {t(step.title)}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "black" }}>
          {t(step.description)}
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={onNext}
            sx={{
              backgroundColor: '#076AAB',
              '&:hover': { backgroundColor: '#055a8c' },
            }}
          >
            {isLastStep ? t('tutorial.finish') : t('tutorial.next')}
          </Button>
        </Box>
      </Paper>
    </>
  );

  // Render via Portal in das separate tutorial-root Element
  // Dies verhindert, dass das Modal das DOM der Haupt-App beeinflusst
  return createPortal(content, modalRoot);
};

export default TutorialOverlay;

