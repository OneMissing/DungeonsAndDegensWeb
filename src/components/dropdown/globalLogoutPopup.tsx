"use client"

import { logoutGlobal } from "@/lib/settings";
import React from "react";

type GlobalLogoutPopupProps = {
  onClose: () => void;
};

export default function GlobalLogoutPopup({ onClose }: GlobalLogoutPopupProps) {
  const handleLogout = async () => {
    await logoutGlobal(); // Call the server action
    onClose(); // Close the popup
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Global Logout</h2>
        <p>Are you sure you want to log out from all devices?</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <form action={handleLogout}>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}