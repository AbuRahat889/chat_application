interface GradientDividerProps {
  text?: string;
}

export default function GradientDivider({ text }: GradientDividerProps) {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      {/* Left gradient line */}
      <div className="flex-1 h-[3px]">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 100%)",
          }}
        />
      </div>

      {/* Center text */}
      <span className="text-sm text-gray-400 flex-shrink-0">{text}</span>

      {/* Right gradient line */}
      <div className="flex-1 h-[3px]">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}
