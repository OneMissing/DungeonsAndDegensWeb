"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="relative h-full w-full bg-black select-none">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/landingBG.webp"
          alt="Dungeons and Dragons Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", 
            WebkitTextStroke: "1px rgba(0, 0, 0, 0.6)",
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Embark on Your Quest
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-2xl mb-8 max-w-2xl drop-shadow-md"
          style={{
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
            WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.5)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Gather your party and venture into the unknown. Forge your path in the
          world of Dungeons & Dragons.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Link
            href="/home"
            className="text-xl inline-block px-8 py-4 bg-red-600 hover:bg-red-700 rounded-2xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Start Your Adventure
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
