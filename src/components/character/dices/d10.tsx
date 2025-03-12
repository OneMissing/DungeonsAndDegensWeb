import { useEffect, useRef } from 'react';

const D10Page: React.FC<{ roll: number }> = ({ roll }) => {
  const diceRef = useRef<HTMLDivElement>(null);

  const getFaceTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(31.7175deg) rotateY(0deg) translateZ(40px)',
      2: 'rotateX(31.7175deg) rotateY(72deg) translateZ(40px)',
      3: 'rotateX(31.7175deg) rotateY(144deg) translateZ(40px)',
      4: 'rotateX(31.7175deg) rotateY(216deg) translateZ(40px)',
      5: 'rotateX(31.7175deg) rotateY(288deg) translateZ(40px)',
      6: 'rotateX(-31.7175deg) rotateY(288deg) translateZ(40px)',
      7: 'rotateX(-31.7175deg) rotateY(216deg) translateZ(40px)',
      8: 'rotateX(-31.7175deg) rotateY(144deg) translateZ(40px)',
      9: 'rotateX(-31.7175deg) rotateY(72deg) translateZ(40px)',
      10: 'rotateX(-31.7175deg) rotateY(0deg) translateZ(40px)',
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
          duration: 1200,
          easing: 'ease-out',
        }
      );

      animation.onfinish = () => {
        dice.style.transform = targetTransform;
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
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 
                       rounded-xl flex items-center justify-center text-2xl font-bold 
                       backface-hidden"
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

export default D10Page;