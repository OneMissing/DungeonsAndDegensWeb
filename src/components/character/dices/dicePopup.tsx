"use client";

import { createContext, ReactNode, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface PopupContextType {
	showPopup: (notation: string) => void;
	closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
	const [result, setResult] = useState<number | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	
	function showPopup(notation: string) {
		setIsOpen(true);
	}

	function closePopup() {
		setIsOpen(false);
	}

	return (
		<PopupContext.Provider value={{ showPopup, closePopup }}>
			{children}
			{isOpen &&
				createPortal(
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="fixed inset-0 bg-black opacity-50" onClick={closePopup}></div>
						<div className="bg-white p-6 rounded-lg shadow-lg relative w-96 z-50" onClick={(e) => e.stopPropagation()}>
						</div>
					</div>,
					document.body
				)}
		</PopupContext.Provider>
	);
}

export function usePopup() {
	const context = useContext(PopupContext);
	if (!context) {
		throw new Error("usePopup must be used within a PopupProvider");
	}
	return context;
}
