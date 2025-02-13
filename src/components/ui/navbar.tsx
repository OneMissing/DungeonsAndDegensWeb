import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    (<nav>
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
            href="/adventure"
            className="text-xl hover:text-yellow-400 transition duration-300">
            Adventure
          </Link>
          <Link
            href="/about"
            className="text-xl hover:text-yellow-400 transition duration-300">
            About
          </Link>
          <Link
            href="/contact"
            className="text-xl hover:text-yellow-400 transition duration-300">
            Contact
          </Link>
        </div>
      </div>
    </nav>)
  );
};

export default Navbar;
