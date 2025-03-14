import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

interface VideoPreviewProps {
  videoUrl: string;
  onReset: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [progress, setProgress] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      console.warn("Video element not found.");
      return; // Exit early if ref is null
    }

    console.log("Video element:", videoElement);
    console.log("Video srcObject:", videoElement.srcObject);
    // const handleTimeUpdate = () => {
    //   if (videoElement.duration) {
    //     setProgress((videoElement.currentTime / videoElement.duration) * 100);
    //   }
    // };

    const handleEnded = () => {
      setIsPlaying(false);
      // setProgress(0);
      if (videoElement) {
        videoElement.currentTime = 0;
      }
    };

    // videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("ended", handleEnded);

    return () => {
      // videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "techie_match_intro.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("Video downloaded successfully!");
  };

  // const handleUpload = () => {
  //   // In a real app, this would integrate with the backend
  // toast.success("Video uploaded to your profile!");
  // };

  return (
    <div className="w-full h-auto animate-fade-in">
      <div className="techie-video-container">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          playsInline
        />

        {/* <div className=" bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
            <div
              className="bg-techie h-full rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div> */}
      </div>

      <div className="mt-6 flex flex-wrap gap-5 justify-center">
        <button
          onClick={togglePlayPause}
          className="cursor-pointer text-white flex gap-2 items-center shadow-xs font-semibold cursor-pointer  hover:bg-red-normal/70  bg-red-normal rounded-lg px-2 py-3"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={onReset}
          className="cursor-pointer text-white flex gap-2 items-center shadow-xs font-semibold cursor-pointer bg-destructive hover:bg-destructive/75 rounded-lg px-2 py-3"
        >
          <RotateCcw className="h-5 w-5" />
          Re-Record
        </button>

        <button
          onClick={handleDownload}
          className="cursor-pointer text-white flex gap-2 items-center shadow-xs font-semibold cursor-pointer hover:bg-green-700  bg-green-800 rounded-lg px-2 py-3"
        >
          <Download className="h-5 w-5" />
          Download
        </button>

        {/* <button
          onClick={handleUpload}
          className="techie-btn techie-btn-primary"
        >
          <Upload className="h-5 w-5" />
          Save to Profile
        </button> */}
      </div>
    </div>
  );
};

export default VideoPreview;
