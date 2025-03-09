import { useState, useEffect } from 'react';

const D10Modal: React.FC<{ roll: number }> = ({ roll }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState(roll);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const faces = Array.from({ length: 20 }, (_, i) => i + 1);

  const getTransform = (number: number) => {
    const transforms: { [key: number]: string } = {
      1: 'rotateX(31.7175deg) rotateY(0deg) translateZ(40px)',
      2: 'rotateX(31.7175deg) rotateY(72deg) translateZ(40px)',
      3: 'rotateX(31.7175deg) rotateY(144deg) translateZ(40px)',
      4: 'rotateX(31.7175deg) rotateY(216deg) translateZ(40px)',
      5: 'rotateX(31.7175deg) rotateY(288deg) translateZ(40px)',
      10: 'rotateX(-31.7175deg) rotateY(0deg) translateZ(40px)',
      9: 'rotateX(-31.7175deg) rotateY(72deg) translateZ(40px)',
      8: 'rotateX(-31.7175deg) rotateY(144deg) translateZ(40px)',
      7: 'rotateX(-31.7175deg) rotateY(216deg) translateZ(40px)',
      6: 'rotateX(-31.7175deg) rotateY(288deg) translateZ(40px)',
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
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary-light dark:bg-primary-dark text-text1-dark px-8 py-4 rounded-xl
                   text-2xl font-bold hover:scale-105 transition-transform shadow-lg"
      >
        🜺 D10 Kostka
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-2-dark p-8 rounded-2xl relative max-w-md w-full
                        border-2 border-secondary-dark shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-secondary-dark text-3xl
                       hover:rotate-90 transition-transform"
            >
              &times;
            </button>

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
        </div>
      )}
    </>
  );
};

export default D10Modal;