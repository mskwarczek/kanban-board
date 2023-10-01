interface PlusProps {
  color?: string;
}

export const Plus = ({ color }: PlusProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_245_34)">
      <path
        d="M7.33334 7.33325V3.33325H8.66668V7.33325H12.6667V8.66659H8.66668V12.6666H7.33334V8.66659H3.33334V7.33325H7.33334Z"
        fill={color || "#88819F"}/>
    </g>
    <defs>
      <clipPath id="clip0_245_34">
        <rect
          width="16"
          height="16"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
