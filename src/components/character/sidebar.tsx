"use client";
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

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
        <div className="flex">
            <div
                className={`sidebar flex-none transition-all duration-300 ease-in-out 
                    ${isOpen ? 'w-64' : 'w-20'} 
                    bg-gray-800 text-white`}
                style={{ width: isOpen ? '16rem' : '5rem' }}
            >
                <ul className="space-y-4 mt-4">
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-700">Home</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-700">About</a></li>
                </ul>
            </div>

            <div
                className={`flex-1 p-4 transition-all duration-300 ease-in-out 
                  ${isOpen ? 'ml-64' : 'ml-20'} 
                  bg-gray-100`}
            >
                <button
                    className="absolute top-4 left-4 bg-gray-700 text-white rounded-full p-2"
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
        </div>
    );
};

export default Sidebar;

