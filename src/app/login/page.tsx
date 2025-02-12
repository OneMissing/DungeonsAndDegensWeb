"use client";
import { useState } from "react";
import { login, signup } from "@/lib/action";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 font-serif">
      <div className="w-full max-w-md p-8 bg-gray-800 shadow-2xl rounded-2xl border border-gray-700">
        <h1 className="text-3xl mb-6 text-center font-bold tracking-widest uppercase">
          {isSignUp ? "Sign Up" : "Log In"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-700"
          />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-700"
          />
          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-700"
            />
          )}
          <button
            type="submit"
            className="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 rounded-xl shadow-lg transition duration-300"
          >
            {isSignUp ? "Create Account" : "Log In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={toggleAuthMode}
              className="text-purple-500 hover:text-purple-400 ml-2 underline"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
