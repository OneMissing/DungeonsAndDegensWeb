import { changeEmail, changePassword,  globalLogout } from "@/lib/settings";
import React, { useState, useRef, useEffect } from "react";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        ⚙ Settings
      </button>
      {isOpen && (
        <div>
          <button onClick={globalLogout}>
            Global logout
          </button>
          <button onClick={changePassword}>
            Change password
          </button>
          <button onClick={changePassword}>
            Change email
          </button>
        </div>
      )}
    </div>
  );
}

export default Dropdown;