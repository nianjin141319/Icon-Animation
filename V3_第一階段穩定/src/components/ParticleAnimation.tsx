import { useEffect, useRef, useState } from "react";
import AiIconDot from "../imports/AiIconDot";

interface Particle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  radius: number;
  distanceFromCenter: number;
  opacity: number;
  scale: number;
}

interface ParticleAnimationProps {
  size: number;
  duration: number;
  restartKey: number;
}

export function ParticleAnimation({
  size,
  duration,
  restartKey,
}: ParticleAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFinalDesign, setShowFinalDesign] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const designRef = useRef<HTMLDivElement>(null);

  // Generate hexagonal grid with dynamic particle count
  const generateHexagonalGrid = (containerSize: number) => {
    const particles: Particle[] = [];
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const hexRadius = containerSize * 0.38; // Hexagon boundary radius

    // Calculate spacing based on container size for consistent pattern
    const particleSpacing = containerSize * 0.035;

    let particleCount = 0;

    // Generate hexagonal grid pattern
    for (let row = -15; row <= 15; row++) {
      const rowOffset = row * particleSpacing * 0.866; // √3/2 for hex spacing
      const colOffset = (row % 2) * particleSpacing * 0.5;

      for (let col = -15; col <= 15; col++) {
        const x = centerX + col * particleSpacing + colOffset;
        const y = centerY + rowOffset;

        // Check if point is within hexagonal boundary
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= hexRadius) {
          particles.push({
            id: particleCount,
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            currentX: x,
            currentY: y,
            radius: Math.max(2, containerSize * 0.003),
            distanceFromCenter: distance,
            opacity: 0,
            scale: 0,
          });
          particleCount++;
        }
      }
    }

    // Sort by distance from center for reveal animation
    return particles.sort(
      (a, b) => a.distanceFromCenter - b.distanceFromCenter,
    );
  };

  // Extract design positions from the AI icon SVG
  const extractDesignPositions = () => {
    if (!designRef.current) return [];

    const svg = designRef.current.querySelector("svg");
    if (!svg) return [];

    const positions: { x: number; y: number }[] = [];
    const containerSize = size;

    // Get viewBox dimensions
    const viewBox = svg
      .getAttribute("viewBox")
      ?.split(" ")
      .map(Number) || [0, 0, 800, 800];
    const svgWidth = viewBox[2];
    const svgHeight = viewBox[3];

    // Extract circles from the design
    const circles = svg.querySelectorAll("circle");
    circles.forEach((circle) => {
      const cx = parseFloat(circle.getAttribute("cx") || "0");
      const cy = parseFloat(circle.getAttribute("cy") || "0");
      const r = parseFloat(circle.getAttribute("r") || "0");

      // Add center point
      positions.push({
        x: (cx / svgWidth) * containerSize,
        y: (cy / svgHeight) * containerSize,
      });

      // Add points around circle perimeter for better coverage
      const perimeterPoints = Math.max(6, Math.floor(r / 2));
      for (let i = 0; i < perimeterPoints; i++) {
        const angle = (i / perimeterPoints) * Math.PI * 2;
        positions.push({
          x:
            ((cx + Math.cos(angle) * r * 0.8) / svgWidth) *
            containerSize,
          y:
            ((cy + Math.sin(angle) * r * 0.8) / svgHeight) *
            containerSize,
        });
      }
    });

    // Extract paths and sample points along them
    const paths = svg.querySelectorAll("path");
    paths.forEach((path) => {
      try {
        const pathLength = (
          path as SVGPathElement
        ).getTotalLength();
        const sampleCount = Math.max(
          30,
          Math.ceil(pathLength / 10),
        );

        for (let i = 0; i <= sampleCount; i++) {
          const point = (
            path as SVGPathElement
          ).getPointAtLength((i / sampleCount) * pathLength);
          positions.push({
            x: (point.x / svgWidth) * containerSize,
            y: (point.y / svgHeight) * containerSize,
          });
        }
      } catch (e) {
        // Skip paths that can't be measured
      }
    });

    return positions;
  };

  // Initialize particles and map to design positions
  useEffect(() => {
    setShowFinalDesign(false);

    const initialParticles = generateHexagonalGrid(size);

    // Small delay to ensure design is rendered
    setTimeout(() => {
      const designPositions = extractDesignPositions();

      if (designPositions.length === 0) {
        setParticles(initialParticles);
        startTimeRef.current = Date.now();
        return;
      }

      // Map particles to design positions
      const updatedParticles = initialParticles.map(
        (particle, index) => {
          // Distribute particles across design positions
          const positionRatio = index / initialParticles.length;
          const targetIndex = Math.floor(
            positionRatio * designPositions.length,
          );
          const target =
            designPositions[
              Math.min(targetIndex, designPositions.length - 1)
            ];

          return {
            ...particle,
            endX: target.x,
            endY: target.y,
          };
        },
      );

      setParticles(updatedParticles);
      startTimeRef.current = Date.now();
    }, 100);
  }, [size, restartKey]);

  // Animation loop
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      const elapsed =
        (Date.now() - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setShowFinalDesign(true);
        return;
      }

      setParticles((prevParticles) => {
        const maxDistance = Math.max(
          ...prevParticles.map((p) => p.distanceFromCenter),
        );

        return prevParticles.map((particle) => {
          // Normalize distance for wave-based reveal (0 to 1)
          const normalizedDistance =
            particle.distanceFromCenter / maxDistance;

          // Multiple waves: Scale and opacity animation (first 40% of total duration)
          // Each wave is triggered based on distance from center
          const scaleStart = normalizedDistance * 0.3; // Stagger start based on distance
          const scaleEnd = scaleStart + 0.2; // Duration of scale/fade animation per particle
          const scaleProgress = Math.min(
            Math.max(
              (progress - scaleStart) / (scaleEnd - scaleStart),
              0,
            ),
            1,
          );

          // Movement phase: particles move to final positions (30% to 100% of animation)
          const moveStart = 0.25 + normalizedDistance * 0.15;
          const moveEnd = 1.0;
          const moveProgress = Math.min(
            Math.max(
              (progress - moveStart) / (moveEnd - moveStart),
              0,
            ),
            1,
          );

          // Apply smooth easing functions (ease-in-out for both scale and position)
          const easedScale = easeInOutCubic(scaleProgress);
          const easedMove = easeInOutCubic(moveProgress);

          // Calculate current position with interpolation
          const currentX =
            particle.startX +
            (particle.endX - particle.startX) * easedMove;
          const currentY =
            particle.startY +
            (particle.endY - particle.startY) * easedMove;

          return {
            ...particle,
            currentX,
            currentY,
            opacity: easedScale, // Fade in from 0
            scale: easedScale, // Scale up from 0
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, duration]);

  // Easing functions for smooth motion
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Hidden design reference for position extraction */}
      <div
        ref={designRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: size, height: size }}
      >
        <AiIconDot />
      </div>

      {/* Particle canvas */}
      <svg
        width={size}
        height={size}
        className="absolute top-0 left-0"
        style={{ background: "#000" }}
      >
        <defs>
          <filter id="particleBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Render particles with dual layers */}
        {particles.map((particle) => (
          <g key={particle.id} opacity={particle.opacity}>
            {/* Blurred top layer */}
            <circle
              cx={particle.currentX}
              cy={particle.currentY}
              r={particle.radius * particle.scale}
              fill="#FFF"
              filter="url(#particleBlur)"
              opacity="0.6"
            />
            {/* Solid bottom layer */}
            <circle
              cx={particle.currentX}
              cy={particle.currentY}
              r={particle.radius * particle.scale}
              fill="#FFF"
            />
          </g>
        ))}
      </svg>

      {/* Show final design when animation completes */}
      {showFinalDesign && (
        <div
          className="absolute top-0 left-0 animate-in fade-in duration-1000"
          style={{ width: size, height: size }}
        >
          <AiIconDot />
        </div>
      )}
    </div>
  );
}