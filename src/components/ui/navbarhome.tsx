import React from 'react';
import Link from 'next/link';
import LogoutPage from '@/components/ui/logout';

const NavbarHome = () => {
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
          <LogoutPage />
          <Link href="/home">Home</Link>
        </div>
      </div>
    </nav>)
  );
};

export default NavbarHome;
