interface CheckProps {
  color?: string;
  isSmall?: boolean;
}

export const Check = ({ color, isSmall }: CheckProps) => {
  if (isSmall) return (
    <svg 
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.16668 4.32163L6.99668 0.491211L7.58627 1.08038L3.16668 5.49996L0.515015 2.84829L1.10418 2.25913L3.16668 4.32163Z"
        fill="white"
      />
    </svg>
  );

  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.16668 10.1148L13.2947 3.98608L14.238 4.92875L7.16668 12.0001L2.92401 7.75742L3.86668 6.81475L7.16668 10.1148Z"
        fill={color || "#594F78"}
      />
    </svg>
  );
}
