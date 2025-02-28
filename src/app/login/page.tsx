"use client";
import { useState } from "react";
import { login, signup } from "@/lib/supabase/actions";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (isSignUp) {
      await signup(formData);
    } else {
      await login(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-100 font-serif">
      <div className="w-full max-w-md p-8 bg-gray-800 shadow-2xl rounded-2xl border-4 border-gray-700">
        <h1 className="text-4xl mb-6 text-center font-extrabold tracking-wider uppercase text-yellow-500 drop-shadow-lg">
          {isSignUp ? "Join the Realm" : "Enter the Keep"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Your Scroll of Contact"
            required
            className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-4 focus:ring-yellow-700 placeholder-gray-400 text-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Secret Rune"
            required
            className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-4 focus:ring-yellow-700 placeholder-gray-400 text-lg"
          />
          {isSignUp && (
            <input
              id="password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter Secret Rune"
              required
              className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-4 focus:ring-yellow-700 placeholder-gray-400 text-lg"
            />
          )}
          <button
            type="submit"
            className="w-full bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-xl transition duration-300 text-lg tracking-wide border-2 border-yellow-500"
          >
            {isSignUp ? "Forge Account" : "Unlock Portal"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isSignUp ? "A member of the guild already?" : "Yet to forge your path?"}
            <button
              onClick={toggleAuthMode}
              className="text-yellow-500 hover:text-yellow-400 ml-2 underline font-semibold"
            >
              {isSignUp ? "Enter Keep" : "Join the Realm"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
