'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cinzel } from 'next/font/google'

const gothicFont = Cinzel({ subsets: ['latin'], weight: '700' })

export default function App() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
    
      <Image 
        src="/errorpageBG.jpg"
        alt="ERROR PAGE"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute inset-0 z-0"
      />
      
      
      <motion.div 
        className="relative z-10 flex flex-col items-center text-center px-4"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
       
        <motion.p 
          className={`${gothicFont.className} text-white text-2xl md:text-4xl font-bold bg-black/50 px-6 py-4 rounded-lg shadow-lg`}
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
          <Link href="/home" passHref>
            <motion.button
              className="mt-6 text-lg md:text-xl px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-2xl shadow-lg border-2 border-black transition duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition duration-300"></span>
              Log in
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}