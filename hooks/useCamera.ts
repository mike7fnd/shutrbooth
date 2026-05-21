'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type FacingMode = 'user' | 'environment';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  switchCamera: () => void;
  facingMode: FacingMode;
  isSupported: boolean;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('user');
  const [isSupported, setIsSupported] = useState(true);

  const startCamera = useCallback(async (mode: FacingMode) => {
    setIsLoading(true);
    setError(null);

    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError('Camera not supported in this browser.');
      setIsLoading(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(() => {
          // Autoplay may be blocked
        });
      }

      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access and refresh.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setError('No camera found on this device.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setError('Camera is already in use by another application.');
      } else {
        setError('Could not access camera. Please try again.');
      }
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      // Cleanup on unmount
      setStream((prevStream) => {
        if (prevStream) {
          prevStream.getTracks().forEach((track) => track.stop());
        }
        return null;
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchCamera = useCallback(() => {
    const newMode: FacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  }, [facingMode, startCamera]);

  return {
    videoRef,
    stream,
    isLoading,
    error,
    switchCamera,
    facingMode,
    isSupported,
  };
}
