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

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined") return;
      const { data } = await supabase.auth.getUser();
      setIsLogged(!!data.user);
    };

    fetchUser();
  }, [supabase]);

  const navButtons = (className: string) => (
    <div className={className}>
      <Link href="/home" className="text-xl hover:text-yellow-400 transition duration-300 dark:text-black">
        Home
      </Link>
      <Link href="/wiki" className="text-xl hover:text-yellow-400 transition duration-300 dark:text-black">
        Adventure
      </Link>
      <Link href="/about" className="text-xl hover:text-yellow-400 transition duration-300 dark:text-black">
        About
      </Link>
      {isLogged && (
        <Link href="/home/maps" className="text-xl hover:text-yellow-400 transition duration-300 dark:text-black">
          Map
        </Link>
      )}
      {isLogged && (
        <button onClick={logout} className="text-xl hover:text-yellow-400 transition duration-300 dark:text-black">
          Logout
        </button>
      )}
      <ThemeToggle className="text-black dark:text-white" />
    </div>
  );

  return (
    <nav className="bg-brown-700 text-white p-4 border-b-2 border-brown-900 absolute w-full z-[10000]">
      <div className="mx-auto flex items-center justify-between px-6 max-w-7xl">
        <div className="flex-1">
          <Link href="/" className="text-4xl font-serif font-bold hover:text-yellow-400 transition duration-300 dark:text-black">
            Dungeons & Degens
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 items-center">{navButtons("flex space-x-6")}</div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-end bg-brown-700 p-4 rounded-lg border border-brown-900 transition-all duration-300 ease-in-out origin-top">
          {navButtons("flex flex-col space-y-4")}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
