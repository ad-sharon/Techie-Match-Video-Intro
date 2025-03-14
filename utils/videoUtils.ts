// **
//  * Utility functions for video recording
//  */

// Maximum recording time in seconds
export const MAX_RECORDING_TIME = 60;

// Type for the recording state
export type RecordingState = "inactive" | "recording" | "paused" | "completed";

// Interface for the recording timer
export interface RecordingTimer {
  elapsedTime: number;
  formattedTime: string;
}

// Format seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Get user media stream with video and audio
export const getMediaStream = async (): Promise<MediaStream> => {
  try {
    const constraints = {
      audio: true,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error("Error accessing media devices:", error);
    throw error;
  }
};

// Create a blob from recorded chunks
export const createVideoBlob = (chunks: Blob[]): Blob => {
  return new Blob(chunks, { type: "video/webm" });
};

// Create a downloadable URL for the recorded video
export const createDownloadLink = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

// Generate a unique filename for the video
export const generateVideoFilename = (): string => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  return `techie_match_intro_${timestamp}.webm`;
};

// Helper to clean up resources when recording is done
export const cleanupResources = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};
