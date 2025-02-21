"use client";

import React, { useState, useEffect } from 'react';
import styles from '/styles/components/Sidebar.module.css';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(16);

  useEffect(() => {
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement) {
      const width = isOpen ? sidebarElement.offsetWidth : 0;
      setSidebarWidth(width);
    }
  }, [isOpen]);

  return (
    <div className={`${styles.container} flex`}>
      <div
        id="sidebar"
        className={`${styles.sidebar} 
                    ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        style={{ width: isOpen ? '16rem' : '5rem' }}
      >
        <ul className={styles.nav}>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </div>
      <div
        className={`${styles.content} 
                    flex-1 p-4 
                    ${isOpen ? styles.contentShifted : styles.contentShiftedBack}`}
      >
        <button
          className={styles.toggleButton}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            left: isOpen ? `calc(${sidebarWidth}px + 20px)` : '20px'
          }}
        >
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
