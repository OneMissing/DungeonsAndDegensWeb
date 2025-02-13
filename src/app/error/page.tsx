'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function App() {
  return (
    <div className="relative h-screen w-screen">
 
      <Image 
        src="/errorpageBG.jpg"
        alt="ERROR PAGE"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      
 
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        <motion.p 
          className="text-white text-xl font-bold bg-black/50 px-4 py-2 rounded-lg"
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          Temné síly ti zkřížily cestu. Vrať se na přihlašovací stránku a zkus to znovu!
        </motion.p>
        
      
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <Link
            href="/home"
            passHref
            className="mt-6 text-lg px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-2xl shadow-lg transition duration-300"
          > 
            Log in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
