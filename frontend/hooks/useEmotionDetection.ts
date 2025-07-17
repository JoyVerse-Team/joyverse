// React hook for landmark-based emotion detection
// This provides a clean interface for React components to use emotion detection

import { useState, useCallback, useRef } from 'react';
import { landmarkEmotionDetector, type LandmarkEmotionData } from '@/lib/landmark-emotion-detector';

export interface UseEmotionDetectionReturn {
  // Current emotion state
  currentEmotion: LandmarkEmotionData | null;
  isDetecting: boolean;
  error: string | null;
  
  // Single capture methods
  captureEmotion: () => Promise<LandmarkEmotionData>;
  
  // Continuous detection methods
  startContinuousDetection: (intervalMs?: number) => Promise<void>;
  stopContinuousDetection: () => void;
  
  // Utility methods
  clearError: () => void;
  reset: () => void;
}

export function useEmotionDetection(): UseEmotionDetectionReturn {
  const [currentEmotion, setCurrentEmotion] = useState<LandmarkEmotionData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const continuousDetectionCleanup = useRef<(() => void) | null>(null);

  const captureEmotion = useCallback(async (): Promise<LandmarkEmotionData> => {
    if (isDetecting) {
      throw new Error('Already detecting emotion');
    }

    setIsDetecting(true);
    setError(null);

    try {
      const emotion = await landmarkEmotionDetector.captureAndDetectEmotion();
      setCurrentEmotion(emotion);
      return emotion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDetecting(false);
    }
  }, [isDetecting]);

  const startContinuousDetection = useCallback(async (intervalMs: number = 1000): Promise<void> => {
    if (continuousDetectionCleanup.current) {
      continuousDetectionCleanup.current();
    }

    setIsDetecting(true);
    setError(null);

    try {
      const cleanup = await landmarkEmotionDetector.startContinuousDetection(
        (emotion) => {
          setCurrentEmotion(emotion);
        },
        intervalMs
      );

      continuousDetectionCleanup.current = cleanup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsDetecting(false);
      throw err;
    }
  }, []);

  const stopContinuousDetection = useCallback(() => {
    if (continuousDetectionCleanup.current) {
      continuousDetectionCleanup.current();
      continuousDetectionCleanup.current = null;
    }
    setIsDetecting(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    stopContinuousDetection();
    setCurrentEmotion(null);
    setError(null);
  }, [stopContinuousDetection]);

  return {
    currentEmotion,
    isDetecting,
    error,
    captureEmotion,
    startContinuousDetection,
    stopContinuousDetection,
    clearError,
    reset
  };
}
