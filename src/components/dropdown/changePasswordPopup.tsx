"use client"

import React, { useState } from "react";

type ChangePasswordPopupProps = {
  onClose: () => void;
};

export default function ChangePasswordPopup({ onClose }: ChangePasswordPopupProps) {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Call your change password API or function here
    console.log("Changing password to:", newPassword);
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}