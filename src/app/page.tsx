import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative h-screen w-full bg-black">
      <div className="absolute inset-0">
        <Image 
          src="/landingBG.webp"
          alt="Dungeons and Dragons Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
    </div>
  );
}
