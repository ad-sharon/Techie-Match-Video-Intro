import React, { useState, useRef, useEffect } from "react";
import { Video, Timer, X } from "lucide-react";
import { toast } from "sonner";
import VideoPreview from "./videoPreview";
import RecordingTips from "./recordingTips";
import {
  RecordingState,
  MAX_RECORDING_TIME,
  formatTime,
  getMediaStream,
  createVideoBlob,
  createDownloadLink,
  cleanupResources,
} from "../../../utils/videoUtils";

const VideoIntro: React.FC = () => {
  const [recordingState, setRecordingState] =
    useState<RecordingState>("inactive");
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      cleanupResources(streamRef.current);
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [recordedVideoUrl]);

  useEffect(() => {
    if (
      recordingState === "recording" &&
      streamRef.current &&
      videoRef.current
    ) {
      videoRef.current.srcObject = streamRef.current;

      videoRef.current
        .play()
        .then(() => console.log("Video is playing."))
        .catch((err) => console.error("Error playing video:", err));
    }
  }, [recordingState]);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      setShowIntro(false);

      const stream = await getMediaStream();
      console.log("Media Stream:", stream);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.style.display = "block";
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = createVideoBlob(chunksRef.current);
        const videoUrl = createDownloadLink(videoBlob);
        setRecordedVideoUrl(videoUrl);
        cleanupResources(streamRef.current);
        streamRef.current = null;
        setRecordingState("completed");
      };

      mediaRecorder.start(200);
      mediaRecorderRef.current = mediaRecorder;
      setRecordingState("recording");

      setElapsedTime(0);
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;

          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }

          return newTime;
        });
      }, 1000);

      toast.success("Recording started! Smile and be yourself.", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error starting recording:", error);

      if ((error as Error).name === "NotAllowedError") {
        toast.error(
          "Permission denied. Please allow camera and microphone access."
        );
      } else {
        toast.error("Failed to start recording. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const resetRecording = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }

    setRecordedVideoUrl(null);
    setRecordingState("inactive");
    setElapsedTime(0);
    chunksRef.current = [];
    setShowIntro(true);
  };

  const renderContent = () => {
    if (recordingState === "completed" && recordedVideoUrl) {
      return (
        <VideoPreview videoUrl={recordedVideoUrl} onReset={resetRecording} />
      );
    }

    return (
      <div className="w-full animate-fade-in">
        <div className="techie-video-container relative overflow-hidden rounded-lg aspect-video bg-black">
          {recordingState === "inactive" ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-900/70 to-red-normal/70">
              {showIntro && (
                <div className="text-white text-center p-6 animate-scale-up">
                  <p className="text-gray-200 max-w-md mx-auto">
                    Record a short introduction about yourself, your interests,
                    and what you&apos;re looking for.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              style={{ display: "block" }}
            />
          )}

          {recordingState === "recording" && (
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between">
              <video
                ref={videoRef}
                className="w-full h-full object-cover p-0"
                playsInline
                autoPlay
                style={{ display: "block" }}
              />
              <div className="flex items-center space-x-2 z-50">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-medium">Recording</span>
              </div>

              <div className="px-3 py-1 rounded-full flex items-center">
                <Timer className="w-4 h-4 text-white mr-1.5" />
                <span className="text-white font-medium">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {recordingState === "inactive" ? (
            <button
              onClick={startRecording}
              className="flex gap-2 items-center shadow-xs font-semibold cursor-pointer text-white hover:bg-primary animate-pulse-record bg-red-normal rounded-lg px-2 py-3"
            >
              <Video className="h-5 w-5" />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex gap-2 items-center shadow-xs font-semibold cursor-pointer text-white hover:bg-destructive/75 animate-pulse-record bg-destructive rounded-lg px-2 py-3"
            >
              <X className="h-5 w-5" />
              Stop Recording
            </button>
          )}
        </div>
      </div>
    );
  };

  // full page
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="py-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Record Your Intro Video
        </h2>

        {renderContent()}

        {recordingState === "inactive" && <RecordingTips />}
      </div>
    </div>
  );
};

export default VideoIntro;
