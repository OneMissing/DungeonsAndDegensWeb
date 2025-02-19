"use client"

import React, { useState } from "react";

type ChangeEmailPopupProps = {
  onClose: () => void;
};

export default function ChangeEmailPopup({ onClose }: ChangeEmailPopupProps) {
  const [newEmail, setNewEmail] = useState<string>("");

  const handleChangeEmail = async () => {
    if (!newEmail) {
      alert("Please enter a valid email");
      return;
    }

    // Call your change email API or function here
    console.log("Changing email to:", newEmail);
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Change Email</h2>
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleChangeEmail}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}