import { useEffect, useRef } from 'react';

const D6Page: React.FC<{ roll: number }> = ({ roll }) => {
  const cubeRef = useRef<HTMLDivElement>(null);

  const getCubeTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(0deg) rotateY(0deg)',
      2: 'rotateY(180deg)',
      3: 'rotateY(-90deg)',
      4: 'rotateY(90deg)',
      5: 'rotateX(90deg)',
      6: 'rotateX(-90deg)',
    };
    return transforms[number] || '';
  };

  useEffect(() => {
    const cube = cubeRef.current;
    if (cube) {
      const targetTransform = getCubeTransform(roll);
      const animation = cube.animate(
        [
          { transform: 'rotateX(0) rotateY(0)' },
          { transform: `rotateY(720deg) ${targetTransform}` }
        ],
        {
          duration: 1000,
          easing: 'ease-out',
        }
      );

      animation.onfinish = () => {
        cube.style.transform = targetTransform;
      };
    }
  }, [roll]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-48 h-48 perspective-1000">
        <div
          ref={cubeRef}
          className="w-full h-full relative preserve-3d"
        >
          <div className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold backface-hidden" 
               style={{ transform: 'translateZ(50px)' }}>
            1
          </div>
          <div className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold backface-hidden" 
               style={{ transform: 'rotateY(180deg) translateZ(50px)' }}>
            2
          </div>
          <div className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold backface-hidden" 
               style={{ transform: 'rotateY(-90deg) translateZ(50px)' }}>
            3
          </div>
          <div className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold backface-hidden" 
               style={{ transform: 'rotateY(90deg) translateZ(50px)' }}>
            4
          </div>
          <div className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold backface-hidden" 
               style={{ transform: 'rotateX(90deg) translateZ(50px)' }}>
            5
          </div>
          <div className="absolute w-full h-full bg-gray-200 border-2 border-gray-700 rounded-xl flex items-center justify-center text-2xl font-bold backface-hidden" 
               style={{ transform: 'rotateX(-90deg) translateZ(50px)' }}>
            6
          </div>
        </div>
      </div>
    </div>
  );
};

export default D6Page;