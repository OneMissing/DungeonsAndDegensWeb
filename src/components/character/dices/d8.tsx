import { useState, useEffect } from 'react';

const D8Page: React.FC<{ roll: number }> = ({ roll }) => {
  const [result, setResult] = useState(roll);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const faces = Array.from({ length: 8 }, (_, i) => i + 1); 

  const getTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(54.7356deg) rotateY(0deg) translateZ(40px)',
      2: 'rotateX(54.7356deg) rotateY(90deg) translateZ(40px)',
      3: 'rotateX(54.7356deg) rotateY(180deg) translateZ(40px)',
      4: 'rotateX(54.7356deg) rotateY(270deg) translateZ(40px)',
      5: 'rotateX(-54.7356deg) rotateY(0deg) translateZ(40px)',
      6: 'rotateX(-54.7356deg) rotateY(90deg) translateZ(40px)',
      7: 'rotateX(-54.7356deg) rotateY(180deg) translateZ(40px)',
      8: 'rotateX(-54.7356deg) rotateY(270deg) translateZ(40px)',
    };
    return transforms[number] || '';
  };

  useEffect(() => {
    if (isRolling) {
      setTimeout(() => {
        setIsRolling(false);
        setResult(roll + modifier);
        setHistory(prev => [`${roll} + ${modifier} = ${roll + modifier}`, ...prev.slice(0, 4)]);
      }, 1800);
    }
  }, [roll, modifier, isRolling]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-6">D8 Kostka</h1>

      <div className="text-6xl text-center my-4 font-papyrus text-primary-dark">
        {result}
      </div>

      <div className="flex justify-center my-8">
        <div className="w-48 h-48 perspective-1000 cursor-pointer">
          <div className={`w-full h-full relative preserve-3d ${isRolling ? 'animate-roll' : ''}`}>
            {faces.map((num) => (
              <div
                key={num}
                className="absolute w-full h-full bg-gradient-to-br from-secondary-dark to-secondary-light
                         border-2 border-text1-dark rounded-xl flex items-center justify-center
                         text-2xl font-bold backface-hidden"
                style={{ transform: getTransform(num) }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <input
          type="number"
          value={modifier}
          onChange={(e) => setModifier(Number(e.target.value))}
          className="bg-3-dark border-2 border-secondary-dark rounded-lg px-4 py-2
                   text-center text-xl w-32 focus:outline-none focus:ring-2
                   focus:ring-secondary-dark"
          placeholder="Mod"
        />

        <button
          onClick={() => setIsRolling(true)}
          className="bg-secondary-dark hover:bg-secondary-light text-text1-dark px-6 py-3 rounded-lg
                   font-bold text-lg transition-colors flex items-center gap-2"
        >
          ⟳ Hodit Znovu
        </button>

        <div className="bg-3-dark p-4 rounded-lg w-full mt-4">
          <h3 className="text-xl font-bold mb-2">📜 Historie:</h3>
          {history.map((entry, i) => (
            <div key={i} className="py-1 border-b border-border-dark last:border-0">
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
