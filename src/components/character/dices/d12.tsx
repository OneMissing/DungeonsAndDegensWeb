import { useState, useEffect } from 'react';

const D12Page: React.FC<{ roll: number }> = ({ roll }) => {
  const [result, setResult] = useState(roll);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const faces = Array.from({ length: 12 }, (_, i) => i + 1);

  const getTransform = (number: number) => {
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
    if (isRolling) {
      setTimeout(() => {
        setIsRolling(false);
        setResult(roll + modifier);
        setHistory(prev => [`${roll} + ${modifier} = ${roll + modifier}`, ...prev.slice(0, 4)]);
      }, 1800);
    }
  }, [roll, modifier, isRolling]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-2-dark text-text1-dark p-8">
      <h1 className="text-4xl font-bold mb-6">D12 Hod Kostečkou</h1>
      <div className="text-6xl font-papyrus text-primary-dark mb-4">{result}</div>
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
      <input
        type="number"
        value={modifier}
        onChange={(e) => setModifier(Number(e.target.value))}
        className="bg-3-dark border-2 border-secondary-dark rounded-lg px-4 py-2 text-center text-xl w-32
                   focus:outline-none focus:ring-2 focus:ring-secondary-dark mt-6"
        placeholder="Modifikátor"
      />
      <button
        onClick={() => setIsRolling(true)}
        className="bg-secondary-dark hover:bg-secondary-light text-text1-dark px-6 py-3 rounded-lg
                   font-bold text-lg transition-colors flex items-center gap-2 mt-4"
      >
        ⟳ Hodit Znovu
      </button>
      <div className="bg-3-dark p-4 rounded-lg w-full mt-6 max-w-md">
        <h3 className="text-xl font-bold mb-2">📜 Historie:</h3>
        {history.map((entry, i) => (
          <div key={i} className="py-1 border-b border-border-dark last:border-0">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

export default D12Page;