import React from 'react';
import Link from 'next/link';
import LogoutPage from '@/components/ui/logout';

const NavbarHome = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-gray-900 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center h-full px-6">
        <Link
          href="/"
          className="text-4xl font-serif font-bold text-white hover:text-yellow-400 transition duration-300"
        > Dungeons & Degens </Link>
        <div className="flex space-x-6">
          <Link href="/home" className="hover:text-yellow-400 transition duration-300">Home</Link>
          <Link href="/home/maps" className="hover:text-yellow-400 transition duration-300">maps</Link>
          <LogoutPage />
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;
