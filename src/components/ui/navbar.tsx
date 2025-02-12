import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo or Brand */}
        <Link href="/">
          <a className="text-4xl font-serif font-bold text-white hover:text-yellow-400 transition duration-300">
            Dungeons & Degens
          </a>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/home">
            <a className="text-xl hover:text-yellow-400 transition duration-300">Home</a>
          </Link>
          <Link href="/adventure">
            <a className="text-xl hover:text-yellow-400 transition duration-300">Adventure</a>
          </Link>
          <Link href="/about">
            <a className="text-xl hover:text-yellow-400 transition duration-300">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-xl hover:text-yellow-400 transition duration-300">Contact</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
