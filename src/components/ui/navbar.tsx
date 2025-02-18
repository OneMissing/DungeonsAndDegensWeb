"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/action";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === 'undefined') return;
      const { data, error } = await supabase.auth.getUser();
      setIsLogged(!!data.user); 
    };

    fetchUser();
  }, [supabase]);

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
    </div>
  );

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
    </div>
  );

  return (
    <nav className="bg-brown-700 text-white p-4 border-b-2 border-brown-900">
      <div className="">
      <div className="mx-auto flex justify-between px-6">
        <Link
          href="/"
          className="text-4xl font-serif font-bold hover:text-yellow-400 transition duration-300 overflow-hidden"
        >
          Dungeons & Degens
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
        <div>
          {isLogged ? navButtonsV2("hidden md:flex space-x-3") : navButtonsV1("hidden md:flex space-x-6")}
        </div>
      </div>

      {isOpen && (
        <div>
          {isLogged ? navButtonsV2("md:hidden flex flex-col items-center space-y-4 mt-4 bg-brown-700 p-4 rounded-lg border border-brown-900") : navButtonsV1("md:hidden flex flex-col items-center space-y-4 mt-4 bg-brown-700 p-4 rounded-lg border border-brown-900")}
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
