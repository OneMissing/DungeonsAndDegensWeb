"use client";
import { useState, ReactNode } from "react";

interface SidebarProps {
    children: ReactNode;
    width: string;
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, width, className }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="absolute lg:relative z-[200] h-main transition-all duration-300 ease-out">
            <div
                id="sidebar"
                className="transition-all duration-300 ease-out bg-gray-800 text-white top-0 h-main flex-none overflow-x-hidden"
                style={{
                    width: isOpen ?  `calc(${width})` : "0",
                }}
            >
                <div className="space-y-4 mt-12 p-4" style={{ width }}>
                    {children}
                </div>
            </div>

            <button
                className="absolute top-4 bg-gray-700 text-white rounded-full p-2 transition-all duration-300 ease-out"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    left: isOpen ? `calc(${width} / 2 - 1rem)` : "1rem",
                }}
            >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default Sidebar;
