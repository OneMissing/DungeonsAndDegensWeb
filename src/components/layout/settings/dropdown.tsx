"use client";
import { changeEmail, changePassword, logoutGlobal } from "@/lib/settings";
import { ArrowDownNarrowWide, KeyRound, LogOut, Mail, Settings } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@heroui/dropdown";

type PopupProps = {
	type: string;
	onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ type, onClose }) => {
	const [newPassword, setNewPassword] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const email = e.target.value;
		setNewEmail(email);
		setIsEmailValid(emailRegex.test(email));
	};

	return (
		<div className={styles.popupOverlay}>
			<div className={`${styles.popupContent}`}>
				{type === "logout" && (
					<div className=" w-96 p-6">
						<button
							className={styles.dropDownConfirmationButton}
							onClick={() => {
								logoutGlobal();
								onClose();
							}}>
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
							disabled={newPassword.length < 6}>
							Change Password
						</button>
					</div>
				)}
				{type === "email" && (
					<div>
						<input type="email" placeholder="Enter new email" className={styles.dropDownTextInput} value={newEmail} onChange={handleEmailChange} />
						<button
							className={styles.dropDownConfirmationButton}
							onClick={() => {
								changeEmail(newEmail);
								onClose();
							}}
							disabled={!isEmailValid}>
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

const SettingsDropdown: React.FC<{className? : string}> = (className) => {
	const [popup, setPopup] = useState<string | null>(null);

	const handleItemClick = (type: string) => {
		setPopup(type);
	};

	return (
		<>
			<Dropdown className="relative">
				<DropdownTrigger>
					<Settings className={`${className}`} />
				</DropdownTrigger>
				<DropdownMenu
					aria-label="User Settings"
					onAction={(key) => handleItemClick(key as string)}
					className="absolute right-0 top-1/2 w-48 bg-2-light dark:bg-2-dark text-white shadow-lg rounded-lg border border-gray-600 transform origin-top-right">
					<DropdownItem key="password" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-600 rounded-t">
						<div className="flex">
							<KeyRound className="w-5 h-5 text-gray-300" />
							<span className="w-full text-center">Change Password</span>
						</div>
					</DropdownItem>
					<DropdownItem key="email" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-600">
						<div className="flex">
							<Mail className="w-5 h-5 text-gray-300" />
							<span className="w-full text-center">Change Email</span>
						</div>
					</DropdownItem>
					<DropdownItem key="logout" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-600 border-t border-gray-500 rounded-b">
						<div className="flex">
							<LogOut className="w-5 h-5 text-gray-300" color="red" />
							<span className="w-full text-center">Global Logout</span>
						</div>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			{popup && <Popup type={popup} onClose={() => setPopup(null)} />}
		</>
	);
};

export default SettingsDropdown;