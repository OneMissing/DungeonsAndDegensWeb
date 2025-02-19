"use client"

import React, { useState, useRef, useEffect } from "react";
import GlobalLogoutPopup from "./globalLogoutPopup";
import ChangePasswordPopup from "./changePasswordPopup";
import ChangeEmailPopup from "./changeEmailPopup";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showGlobalLogoutPopup, setShowGlobalLogoutPopup] = useState<boolean>(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState<boolean>(false);
  const [showChangeEmailPopup, setShowChangeEmailPopup] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowGlobalLogoutPopup(false);
        setShowChangePasswordPopup(false);
        setShowChangeEmailPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <img src="/dropdown/dropdown.svg" alt="Settings Icon" className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
          <button
            onClick={() => setShowGlobalLogoutPopup(true)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Global logout
          </button>
          <button
            onClick={() => setShowChangePasswordPopup(true)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Change password
          </button>
          <button
            onClick={() => setShowChangeEmailPopup(true)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Change email
          </button>
        </div>
      )}

      {showGlobalLogoutPopup && (
        <GlobalLogoutPopup onClose={() => setShowGlobalLogoutPopup(false)} />
      )}

      {showChangePasswordPopup && (
        <ChangePasswordPopup onClose={() => setShowChangePasswordPopup(false)} />
      )}

      {showChangeEmailPopup && (
        <ChangeEmailPopup onClose={() => setShowChangeEmailPopup(false)} />
      )}
    </div>
  );
}