import { useState } from "react";
import { ParticleAnimation } from "./components/ParticleAnimation";

export default function App() {
  const [duration, setDuration] = useState(3);
  const [restartKey, setRestartKey] = useState(0);
  const size = 800; // Fixed size


  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Main canvas area - centers the particle animation */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className="relative shadow-[0_0_60px_rgba(6,182,212,0.2)] transition-all duration-500 ease-out"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            flexShrink: 0,
          }}
        >
          <ParticleAnimation
            size={size}
            duration={duration}
            restartKey={restartKey}
          />
        </div>
      </div>
    </div>
  );
}