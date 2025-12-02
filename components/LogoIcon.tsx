// components/LogoIcon.tsx
export default function LogoIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_5px_rgba(0,200,255,0.5)]"
    >
      <path
        d="M512 64L896 256V768L512 960L128 768V256L512 64Z"
        stroke="url(#g1)"
        strokeWidth="50"
        fill="none"
      />
      <path
        d="M352 320L672 512L352 704"
        stroke="url(#g2)"
        strokeWidth="50"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1024" y2="1024">
          <stop offset="0%" stopColor="#00A8FF" />
          <stop offset="100%" stopColor="#0077FF" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1024" y2="0">
          <stop offset="0%" stopColor="#00C8FF" />
          <stop offset="100%" stopColor="#0090FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
