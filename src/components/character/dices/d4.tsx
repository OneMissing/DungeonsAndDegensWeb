import { useEffect, useRef } from 'react';

const D4Page: React.FC<{ roll: number }> = ({ roll }) => {
  const diceRef = useRef<HTMLDivElement>(null);

  const getFaceTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(70.5288deg) translateZ(35px)',
      2: 'rotateX(-70.5288deg) rotateY(180deg) translateZ(35px)',
      3: 'rotateX(-70.5288deg) rotateY(90deg) translateZ(35px)',
      4: 'rotateX(-70.5288deg) rotateY(-90deg) translateZ(35px)',
    };
    return transforms[number] || '';
  };

  useEffect(() => {
    const dice = diceRef.current;
    if (dice) {
      const targetTransform = getFaceTransform(roll);
      const animation = dice.animate(
        [
          { transform: 'rotateX(0) rotateY(0)' },
          { transform: `rotateY(720deg) rotateX(360deg) ${targetTransform}` }
        ],
        {
          duration: 1000,
          easing: 'ease-out',
        }
      );

      animation.onfinish = () => {
        dice.style.transform = `rotateY(720deg) rotateX(360deg) ${targetTransform}`;
      };
    }
  }, [roll]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-48 h-48 perspective-1000">
        <div
          ref={diceRef}
          className="w-full h-full relative preserve-3d"
        >
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 
                       flex items-center justify-center text-2xl font-bold backface-hidden 
                       clip-triangle"
              style={{ transform: getFaceTransform(num) }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default D4Page;