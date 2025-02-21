"use client";

import { ReactNode, useState } from "react";

type PopupProps = {
  title?: string;
  children: ReactNode;
  buttons?: ReactNode;
};

export default function usePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<(value: any) => void>(() => () => {});

  function showPopup(): Promise<boolean> {
    return new Promise((resolve) => {
      setIsOpen(true);
      setResult(() => resolve);
    });
  }

  function closePopup(value: boolean) {
    setIsOpen(false);
    if (result) result(value);
  }

  function Popup({ title, children, buttons }: PopupProps) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}>
        <div className="bg-white p-6 rounded shadow-lg w-96 z-50">
          {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
          <div>{children}</div>
          <div className="mt-4 flex justify-end gap-2">
            {buttons || <button onClick={() => closePopup(false)}>Close</button>}
          </div>
        </div>
        <div className="fixed inset-0 bg-black opacity-50" onClick={() => closePopup(false)}></div>
      </div>
    );
  }

  return { showPopup, Popup, closePopup };
}
