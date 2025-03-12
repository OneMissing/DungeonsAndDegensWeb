import { useEffect, useRef } from 'react';

const D12Page: React.FC<{ roll: number }> = ({ roll }) => {
  const diceRef = useRef<HTMLDivElement>(null);

  const getFaceTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(62.8deg) rotateY(0deg) translateZ(45px)',
      2: 'rotateX(62.8deg) rotateY(30deg) translateZ(45px)',
      3: 'rotateX(62.8deg) rotateY(60deg) translateZ(45px)',
      4: 'rotateX(62.8deg) rotateY(90deg) translateZ(45px)',
      5: 'rotateX(62.8deg) rotateY(120deg) translateZ(45px)',
      6: 'rotateX(62.8deg) rotateY(150deg) translateZ(45px)',
      7: 'rotateX(-62.8deg) rotateY(0deg) translateZ(45px)',
      8: 'rotateX(-62.8deg) rotateY(30deg) translateZ(45px)',
      9: 'rotateX(-62.8deg) rotateY(60deg) translateZ(45px)',
      10: 'rotateX(-62.8deg) rotateY(90deg) translateZ(45px)',
      11: 'rotateX(-62.8deg) rotateY(120deg) translateZ(45px)',
      12: 'rotateX(-62.8deg) rotateY(150deg) translateZ(45px)',
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
          { transform: `rotateY(720deg) rotateX(720deg) ${targetTransform}` }
        ],
        {
          duration: 1500,
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
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
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

export default D12Page;