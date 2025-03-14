"use client";
import { Check } from "lucide-react";

const RecordingTips: React.FC = () => {
  const tips = [
    "Keep your video between 30-60 seconds for best engagement",
    "Ensure you have good lighting and a clean background",
    "Speak clearly and show your personality",
    "Mention your interests and what you're looking for in a match",
    "Be authentic - the goal is to match with people who appreciate the real you",
  ];

  return (
    <div className="animate-slide-up w-full max-w-[600px] mx-auto mt-12">
      <div className="">
        <h3 className="text-2xl font-bold mb-6 text-center">Recording Tips</h3>

        <div className="space-y-5">
          {tips.map((tip, index) => (
            <div key={index} className="flex row gap-4 mx-auto">
              <Check
                strokeWidth={3}
                className="h-5 w-5 flex-shrink-0 text-red-normal"
              />
              <p className="text-gray-800 font-medium w-full max-w-[350px]">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordingTips;
