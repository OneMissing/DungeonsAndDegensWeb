"use client";

import { createContext, ReactNode, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DiceRoller, { DiceType } from "./dice";
import { skillRoll } from "@/lib/rolling/skillRoll";
import { Divider } from "@heroui/react";

interface DiceRoll {
  diceType: DiceType;
  modifier: number;
}

interface PopupContextType {
  showPopup: (notation: string, type: "skill" | "item") => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notation, setNotation] = useState<string>("");
  const [parsedNotation, setParsedNotation] = useState<DiceRoll[]>([]);
  const [result, setResult] = useState<number[]>([]);
  const [mods, setMods] = useState<number[]>([]);
  const [final, setFinal] = useState<number>(0);
  const [type, setType] = useState<"skill" | "item">("skill");
  const [switcher, setSwitcher] = useState(false);

  function showPopup(notation: string, type: "skill" | "item") {
    setIsOpen(true);
    setNotation(notation);
    setType(type);
  }

  function closePopup() {
    setIsOpen(false);
  }

  useEffect(() => {
    const switchTimer = setTimeout(() => setSwitcher(true), 4500);
    return () => {
      clearTimeout(switchTimer);
    };
  }, []);

  useEffect(() => {
    const parseSkillNotation = (diceString: string): DiceRoll[] => {
      const diceRolls = diceString.split(";");
      const results: DiceRoll[] = [];
      for (const roll of diceRolls) {
        const trimmedRoll = roll.trim();
        const match = trimmedRoll.match(/^(\d+)d(\d+)([+-]\d+)?$/);
        if (!match) throw new Error(`Invalid dice notation: ${trimmedRoll}`);
        const numDice = parseInt(match[1], 10);
        const diceType = parseInt(match[2], 10);
        const modifier = match[3] ? parseInt(match[3], 10) : 0;
        if (![4, 6, 8, 10, 12, 20].includes(diceType)) throw new Error(`Invalid dice type: ${diceType}. Valid types are 4, 6, 8, 10, 12, 20.`);
        for (let i = 0; i < numDice; i++) results.push({ diceType: diceType as DiceType, modifier });
      }
      return results;
    };

    try {
      if (type === "skill") {
        const parsed = parseSkillNotation(notation);
        setParsedNotation(parsed);
        setResult([]);
        setFinal(0);
        {
          parsed.map((roll) => {
            const temp = skillRoll(roll.diceType) as number;
            setResult((prev) => [...prev, temp]);
            setMods((prev) => [...prev, roll.modifier]);
            setFinal(final + temp + roll.modifier);
          });
        }

        console.log(parsed);
      }
    } catch (error) {
      setParsedNotation([]);
    }
  }, [notation]);

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={closePopup}></div>
            <div className="bg-white pb-6 pl-6 pr-6 rounded-lg shadow-lg relative w-fit z-50">
              <div className="relative h-16 w-full flex items-center justify-center">
                <div className={`absolute text-5xl transition-all duration-1000 ease-in-out ${switcher ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>{final}</div>
                <div className={`absolute text-5xl transition-all duration-1000 ease-in-out ${switcher ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}>
                  {mods.reduce((acc, num) => acc + num, 0)}
                </div>
              </div>
              <Divider />
              <div className="grid grid-cols-2 justify-center">
                {parsedNotation.map((roll, index) => (
                  <div key={index} className={`${parsedNotation.length - 1 == index && index % 3 == 0 ? "col-span-2" : "col-span-1"}`}>
                    <DiceRoller sides={roll.diceType} rolled={result[index]} />
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) throw new Error("usePopup must be used within a PopupProvider");
  return context;
}
