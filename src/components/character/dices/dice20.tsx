import { useEffect, useRef } from 'react';

const D20Page: React.FC<{ roll: number }> = ({ roll }) => {
  const diceRef = useRef<HTMLDivElement>(null);

  const getFaceTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(58.2825deg) rotateY(0deg) translateZ(50px)',
      2: 'rotateX(58.2825deg) rotateY(72deg) translateZ(50px)',
      3: 'rotateX(58.2825deg) rotateY(144deg) translateZ(50px)',
      4: 'rotateX(58.2825deg) rotateY(216deg) translateZ(50px)',
      5: 'rotateX(58.2825deg) rotateY(288deg) translateZ(50px)',
      20: 'rotateX(-58.2825deg) rotateY(0deg) translateZ(50px)',
      19: 'rotateX(-58.2825deg) rotateY(72deg) translateZ(50px)',
      18: 'rotateX(-58.2825deg) rotateY(144deg) translateZ(50px)',
      17: 'rotateX(-58.2825deg) rotateY(216deg) translateZ(50px)',
      16: 'rotateX(-58.2825deg) rotateY(288deg) translateZ(50px)',
      6: 'rotateX(31.7175deg) rotateY(36deg) translateZ(50px)',
      7: 'rotateX(31.7175deg) rotateY(108deg) translateZ(50px)',
      8: 'rotateX(31.7175deg) rotateY(180deg) translateZ(50px)',
      9: 'rotateX(31.7175deg) rotateY(252deg) translateZ(50px)',
      10: 'rotateX(31.7175deg) rotateY(324deg) translateZ(50px)',
      15: 'rotateX(-31.7175deg) rotateY(36deg) translateZ(50px)',
      14: 'rotateX(-31.7175deg) rotateY(108deg) translateZ(50px)',
      13: 'rotateX(-31.7175deg) rotateY(180deg) translateZ(50px)',
      12: 'rotateX(-31.7175deg) rotateY(252deg) translateZ(50px)',
      11: 'rotateX(-31.7175deg) rotateY(324deg) translateZ(50px)',
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
          { transform: `rotateY(1080deg) rotateX(720deg) ${targetTransform}` }
        ],
        {
          duration: 2000,
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
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
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

export default D20Page;