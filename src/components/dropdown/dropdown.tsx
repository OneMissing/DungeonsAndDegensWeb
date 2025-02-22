"use client";
import { changeEmail, changePassword, logoutGlobal } from "@/lib/dropdown";
import { ArrowDownNarrowWide } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";

type DropdownChildProps = {
  content: string | React.ReactNode;
  onClick: () => void;
};

const DropdownChild: React.FC<DropdownChildProps> = ({ content, onClick }) => {
  return (
    <button onClick={onClick} className={styles.dropDownChild}>
      {typeof content === "string" ? content : <span className="flex items-center">{content}</span>}
    </button>
  );
};

type PopupProps = {
  type: string;
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ type, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setNewEmail(email);
    setIsEmailValid(emailRegex.test(email)); // Validate email
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        {type === "logout" && (
          <div>
            <button
              className={styles.dropDownConfirmationButton}
              onClick={() => {
                logoutGlobal();
                onClose();
              }}
            >
              Logout globally
            </button>
          </div>
        )}
        {type === "password" && (
          <div>
            <input
              type="password"
              required
              placeholder="Enter new password"
              className={styles.dropDownTextInput}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className={styles.dropDownConfirmationButton}
              onClick={() => {
                changePassword(newPassword);
                onClose();
              }}
              disabled={newPassword.length < 6}
            >
              Change Password
            </button>
          </div>
        )}
        {type === "email" && (
          <div>
            <input
              type="email"
              placeholder="Enter new email"
              className={styles.dropDownTextInput}
              value={newEmail}
              onChange={handleEmailChange}
            />
            <button
              className={styles.dropDownConfirmationButton}
              onClick={() => {
                changeEmail(newEmail);
                onClose();
              }}
              disabled={!isEmailValid}
            >
              Change email
            </button>
          </div>
        )}
        <button onClick={onClose} className={styles.dropDownDeclineButton}>
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
    <div className="inline-flex relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.iconButton}>
        <ArrowDownNarrowWide className={styles.icon} />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
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