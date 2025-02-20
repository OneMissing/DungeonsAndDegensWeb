"use client"
import { changeEmail, changePassword, logoutGlobal } from "@/lib/dropdown";
import React, { useState, useRef, useEffect } from "react";

type DropdownChildProps = {
  content: string | React.ReactNode;
  onClick: () => void;
};

const DropdownChild: React.FC<DropdownChildProps> = ({ content, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block px-4 py-2 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-700"
    >
      {typeof content === "string" ? content : <span className="flex items-center">{content}</span>}
    </button>
  );
};

type PopupProps = {
  type: string;
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ type, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {type === "logout" && (
          <div>
            <button className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200" onClick={()=>{logoutGlobal(); onClose();}}>
              Logout globally
            </button>
          </div>
        )}
        {type === "password" && (
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword} // Bind input value to state
              onChange={(e) => setNewPassword(e.target.value)} // Update state on input change
            />
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200" onClick={()=>{changePassword(newPassword); onClose();}}>
              Change Password
            </button>
          </div>
        )}
        {type === "email" && (
          <div>
            <input
              type="text"
              placeholder="Enter new email"
              className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newEmail} // Bind input value to state
              onChange={(e) => setNewEmail(e.target.value)} // Update state on input change
            />
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200" onClick={()=>{changeEmail(newEmail); onClose();}}>
              Change email
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Dropdown: React.FC = () => {
  const [popup, setPopup] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (type: string) => {
    setPopup(type);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (  
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-full p-2 hover:bg-gray-100 transition-colors duration-200"
      >
        Dropdown
      </button>
      {isOpen && (
        <div className="absolute right-0 bg-white border rounded-md shadow-md mt-2 z-10 w-48 transform transition-all duration-200 ease-in-out">
          <DropdownChild content="Global logout" onClick={() => handleItemClick("logout")} />
          <DropdownChild content="Change password" onClick={() => handleItemClick("password")} />
          <DropdownChild content="Change email" onClick={() => handleItemClick("email")} />
        </div>
      )}
      {popup && <Popup type={popup} onClose={() => setPopup(null)} />}
    </div>
  );
};

export default Dropdown;