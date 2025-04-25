// components/ui/WatermarkedSection.tsx
import React from "react";

interface WatermarkedSectionProps {
  watermarkSrc: string;
  className?: string;
  children: React.ReactNode;
}

export default function WatermarkedSection({
  watermarkSrc,
  className = "",
  children,
}: WatermarkedSectionProps) {
  return (
    <div className={`relative overflow-hidden min-h-[500px] ${className}`}>
      {/* Watermark image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src={watermarkSrc}
          alt="MU Logo"
          className="opacity-10 h-72 w-auto object-contain"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
