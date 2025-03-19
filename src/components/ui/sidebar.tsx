"use client";
import { useState, ReactNode } from "react";

interface SidebarProps {
    children: ReactNode;
    width: string;
    className?: string;
    open?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children, width = "100px", className = "absolute lg:relative", open = false }) => {
    const [isOpen, setIsOpen] = useState<boolean>(open);

    return (
        <div className={`${className} z-[200] h-full transition-all duration-300 ease-out`}>
            <div
                id="sidebar"
                className="transition-all duration-300 ease-out bg-2-light dark:bg-2-dark dark:text-secondary-foreground top-0 h-full flex-none overflow-x-hidden"
                style={{
                    width: isOpen ?  `calc(${width})` : "0",
                }}
            >
                <div className={`space-y-4 mt-12 p-4`} style={{ width }}>
                    {children}
                </div>
            </div>

            <button
                className="absolute top-4 bg-1-dark text-white rounded-full p-2 transition-all duration-300 ease-out border-small outline-border-dark dark:border-none"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    left: isOpen ? `calc(${width} / 2 - 1.25rem)` : "1rem",
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