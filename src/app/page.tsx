"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function App() {
  return (
    (<div className="relative h-screen w-full bg-black">
      <div className="absolute inset-0">
        <Image 
          src="/landingBG.webp"
          alt="Dungeons and Dragons Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Embark on Your Quest
        </motion.h1>

        <motion.p 
          className="text-lg md:text-2xl mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Gather your party and venture into the unknown. Forge your path in the world of Dungeons & Dragons.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            href="/home"
            passHref
            className="text-lg px-8 py-4 bg-red-600 hover:bg-red-700 rounded-2xl shadow-lg"> 
          
              Start Your Adventure
           
          </Link>
        </motion.div>
      </div>
    </div>)
  );
}
