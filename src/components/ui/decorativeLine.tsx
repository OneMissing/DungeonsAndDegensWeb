import React from "react";

type DecorativeLineProps = {
  color?: string;
  darkColor?: string;
};

const DecorativeLine: React.FC<DecorativeLineProps> = ({ color = "#ffd700", darkColor="" }) => {
  return (
    <div className="relative w-full my-6 flex items-center">
      <div className={`h-[2px] w-full bg-[${color}]`} style={{ backgroundColor: color }}></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 20"
        className="absolute left-1/2 transform -translate-x-1/2 w-16 h-6 rounded"
      >
        <path
          d="M0,10 L30,10 C35,5 40,5 50,10 C60,15 65,15 70,10 L100,10"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M50,10 C40,0 30,0 20,10 C30,20 40,20 50,10 C60,0 70,0 80,10 C70,20 60,20 50,10"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <div className="h-[2px] w-full" style={{ backgroundColor: color }}></div>
    </div>
  );
};

export default DecorativeLine;