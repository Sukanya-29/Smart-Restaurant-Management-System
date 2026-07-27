export function CurveDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden leading-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-12 w-full sm:h-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,72 L1440,120 L0,120 Z"
          className="fill-secondary"
        />
      </svg>
    </div>
  )
}
