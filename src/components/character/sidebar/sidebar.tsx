"use client";
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import LinkCharacter from "@/components/character/linkCharacter";
import Link from "next/link";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [sidebarWidth, setSidebarWidth] = useState<number>(16);

    useEffect(() => {
        const sidebarElement = document.querySelector('.sidebar') as HTMLElement | null;
        if (sidebarElement) {
            const width = isOpen ? sidebarElement.offsetWidth : 0;
            setSidebarWidth(width);
        }
    }, [isOpen]);

    return (
        <div className="absolute z-[200] h-main">
            {/* Sidebar */}
            <div
                className={`sidebar flex-none transition-all duration-300 ease-in-out bg-gray-800 text-white top-0 h-main p-4`}
                style={{ width: isOpen ? '16rem' : '0rem' }}
            >
                {/* Sidebar content */}
                <ul className="space-y-4 mt-20">
                <li><LinkCharacter /></li>
                <li><Link href='/home/create'>Create character</Link></li>
                </ul>
            </div>

            {/* Main content */}
                {/* Button to toggle sidebar */}
                <button
                    className="absolute top-4 left-4 bg-gray-700 text-white rounded-full p-2 transition-all duration-300 ease-in-out"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        left: isOpen ? `calc(${sidebarWidth}px + 20px)` : '20px'
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
