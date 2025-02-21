"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/action";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "../themes/themeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const supabase = createClient();

  // Check the authentication status when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === 'undefined') return;
      const { data } = await supabase.auth.getUser();
      setIsLogged(!!data.user); 
    };

    // Check user status on load
    fetchUser();

    // Listen to auth state changes (user logs in or logs out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setIsLogged(true);
      } else if (event === "SIGNED_OUT") {
        setIsLogged(false);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Navigation buttons for logged out users
  const navButtonsV1 = (className: string) => (
    <div className={className}>
      <Link
        href="/home"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        Home
      </Link>
      <Link
        href="/wiki"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        Adventure
      </Link>
      <Link
        href="/about"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        About
      </Link>
      <ThemeToggle className="text-xl hover:text-yellow-400 transition duration-300" />
    </div>
  );

  // Navigation buttons for logged in users
  const navButtonsV2 = (className: string) => (
    <div className={className}>
      <Link
        href="/home"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        Home
      </Link>
      <Link
        href="/home/maps"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        Map
      </Link>
      <Link
        href="/wiki"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        Adventure
      </Link>
      <Link
        href="/about"
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        About
      </Link>
      <button
        onClick={logout}
        className="text-xl hover:text-yellow-400 transition duration-300"
      >
        Logout
      </button>
      <ThemeToggle className="text-xl hover:text-yellow-400 transition duration-300" />
    </div>
  );

  return (
    <nav className="bg-brown-700 text-white p-4 border-b-2 border-brown-900 absolute z-[10000]">
      <div className="justify-between w-screen">
        <div className="mx-auto flex justify-between px-6">
          <Link
            href="/"
            className="text-4xl font-serif font-bold hover:text-yellow-400 transition duration-300 overflow-hidden"
          >
            Dungeons
          </Link>

          <div>
            {/* Display different nav options based on login state */}
            {isLogged ? navButtonsV2("hidden md:flex space-x-3") : navButtonsV1("hidden md:flex space-x-6")}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden focus:outline-none"
            >
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile view */}
        {isOpen && (
          <div className="relative">
            {isLogged
              ? navButtonsV2("md:hidden flex flex-col items-center space-y-4 mt-4 bg-brown-700 p-4 rounded-lg border border-brown-900")
              : navButtonsV1("md:hidden flex flex-col items-center space-y-4 mt-4 bg-brown-700 p-4 rounded-lg border border-brown-900")}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
