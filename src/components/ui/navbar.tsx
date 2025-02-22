"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../themes/themeToggle";
import { createClient } from "@/lib/supabase/client";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
      const checkUser = async () => {
          const {
              data: { user },
          } = await supabase.auth.getUser();
          setIsLogged(!!user);
      };
  
      checkUser();
      const intervalId = setInterval(checkUser, 5000); 
      return () => clearInterval(intervalId);
  }, [supabase.auth]);

    const logout = async () => {
        const { error } = await supabase.auth.signOut({ scope: "local" });
        if (!error) {
            setIsLogged(false);
            router.push("/");
        }
    };

    const navButtons = (className: string) => (
        <div className={className}>
            <ThemeToggle className='text-xl hover:text-yellow-400 transition duration-300' />

            <Link
                href='/home'
                className='text-xl hover:text-yellow-400 transition duration-300'
            >
                Home
            </Link>
            <Link
                href='/wiki'
                className='text-xl hover:text-yellow-400 transition duration-300'
            >
                Adventure
            </Link>
            <Link
                href='/about'
                className='text-xl hover:text-yellow-400 transition duration-300'
            >
                About
            </Link>
            {isLogged && (
                <Link
                    href='/home/maps'
                    className='text-xl hover:text-yellow-400 transition duration-300'
                >
                    Map
                </Link>
            )}
            {isLogged && (
                <button
                    onClick={logout}
                    className='text-xl hover:text-yellow-400 transition duration-300'
                >
                    Logout
                </button>
            )}
        </div>
    );
    return (
        <nav className='bg-brown-700 text-white p-4 border-b-2 border-brown-900 absolute z-[10000]'>
            <div className='justify-between w-screen'>
                <div className='mx-auto flex justify-between px-6'>
                    <Link
                        href='/'
                        className='text-4xl font-serif font-bold hover:text-yellow-400 transition duration-300 overflow-hidden'
                    >
                        Dungeons
                    </Link>

                    <div>
                            {navButtons("hidden md:flex space-x-6")}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='md:hidden focus:outline-none'
                        >
                            {isOpen ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className='relative'>
                        {navButtons( "md:hidden flex flex-col items-center space-y-4 mt-4 bg-brown-700 p-4 rounded-lg border border-brown-900" )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
