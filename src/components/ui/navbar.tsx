import React from 'react';
import Link from 'next/link';
import { logout } from '@/lib/action';

const Navbar = () => {
  return (
    (<nav className="h-14">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo or Brand */}
        <Link
          href="/"
          className="text-4xl font-serif font-bold text-white hover:text-yellow-400 transition duration-300">
          
            Dungeons & Degens
          
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            href="/home"
            className="text-xl hover:text-yellow-400 transition duration-300">
            Home
          </Link>
          <Link
            href="/home/maps"
            className="text-xl hover:text-yellow-400 transition duration-300">
            Maps
          </Link>
          <Link
            href="/about"
            className="text-xl hover:text-yellow-400 transition duration-300">
            About
          </Link>
          <button className="text-xl hover:text-red-600 transition duration-300" onClick={logout} >
            Logout
          </button>
        </div>
      </div>
    </nav>)
  );
};

export default Navbar;
