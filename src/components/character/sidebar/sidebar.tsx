"use client";
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import LinkCharacter from "@/components/character/linkCharacter";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [sidebarWidth, setSidebarWidth] = useState<number>(16);

    useEffect(() => {
        const sidebarElement = document.getElementById("sidebar") as HTMLElement | null;
        if (sidebarElement) {
            const width = isOpen ? sidebarElement.offsetWidth : 0;
            setSidebarWidth(width);
        }
    }, [isOpen]);

    return (
        <div className="flex">
            <div
            id="sidebar"
                className={`sidebar flex-none transition-all duration-300 ease-in-out bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-0'} `}
            >
                <ul className="space-y-4 mt-4">
                <li><LinkCharacter /></li>
                <li><Link href='/home/create'>Create character</Link></li>
                </ul>
            </div>

            {/* Main content */}
            <div
                className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isOpen ? 'ml-[16rem]' : 'ml-[8]'}`}
            >
                {/* Button to toggle sidebar */}
                <button
                    className="absolute top-4 left-4 bg-gray-700 text-white rounded-full p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        left: isOpen ? `calc(${sidebarWidth}px + 20px)` : '20px'
                    }}
                >
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
