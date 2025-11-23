import { Button } from './ui/button';
import { Play } from 'lucide-react';

interface AnimationControlsProps {
  onPlay: (duration: number) => void;
}

export function AnimationControls({ onPlay }: AnimationControlsProps) {
  return (
    <div className="w-80 bg-neutral-950 border-l border-cyan-500/20 p-6 flex flex-col gap-6 overflow-auto shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <h2 className="text-white">Animation Controls</h2>
        </div>
        <p className="text-neutral-400 text-sm">
          Select animation speed
        </p>
      </div>

      {/* Play Buttons */}
      <div className="space-y-4">
        <Button
          onClick={() => onPlay(3)}
          className="w-full h-14 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:via-cyan-300 hover:to-blue-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300"
        >
          <Play className="mr-2 h-5 w-5" />
          Play 3s
        </Button>

        <Button
          onClick={() => onPlay(2)}
          className="w-full h-14 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:via-cyan-300 hover:to-blue-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300"
        >
          <Play className="mr-2 h-5 w-5" />
          Play 2s
        </Button>

        <Button
          onClick={() => onPlay(1)}
          className="w-full h-14 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:via-cyan-300 hover:to-blue-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-300"
        >
          <Play className="mr-2 h-5 w-5" />
          Play 1s
        </Button>
      </div>

      {/* Info Panel */}
      <div className="mt-auto pt-6 space-y-3 border-t border-cyan-500/10">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              <span className="text-cyan-300">Hexagonal grid</span> with dynamic particle count
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dual-layer rendering with <span className="text-cyan-300">8px blur effect</span>
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Center-outward <span className="text-cyan-300">wave animation</span>
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Smooth morphing with <span className="text-cyan-300">ease-in-out transitions</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}