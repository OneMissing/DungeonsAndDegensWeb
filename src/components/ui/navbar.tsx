"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/lib/action';
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="absolute z-[150] bg-brown-700 text-white p-4 border-b-2 border-brown-900">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/" className="text-4xl font-serif font-bold hover:text-yellow-400 transition duration-300">
          Dungeons & Degens
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden focus:outline-none">
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-brown-700 p-4 rounded-lg border border-brown-900">
          <Link href="/home" className="text-xl hover:text-yellow-400 transition duration-300">Home</Link>
          <Link href="/adventure" className="text-xl hover:text-yellow-400 transition duration-300">Adventure</Link>
          <Link href="/about" className="text-xl hover:text-yellow-400 transition duration-300">About</Link>
          <Link href="/contact" className="text-xl hover:text-yellow-400 transition duration-300">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
