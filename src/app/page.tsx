"use client";

import VideoIntro from "./components/videoIntro";
import AppLayout from "../../layout/app-layout";
// import Image

const VideoIntroPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen max-w-[440px]">
        <main className="container mx-auto py-8">
          <VideoIntro />
        </main>
      </div>
    </AppLayout>
  );
};

export default VideoIntroPage;
