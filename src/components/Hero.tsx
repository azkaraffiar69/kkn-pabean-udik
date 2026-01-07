"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  
  // Mengambil progress scroll dari container ini
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background gerak 30% lebih lambat (efek parallax)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Teks gerak sedikit ke atas buat dramatisasi
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      ref={ref} 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* BACKGROUND LAYER: FOTO PARALLAX */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        {/* Ganti URL foto dengan foto tim KKN lo atau pemandangan Pabean Udik */}
        <div 
          className="absolute inset-0 bg-[url('https://i.ibb.co.com/FLtWwZ5S/avadvdv.jpg')] bg-cover bg-center"
        />
        {/* OVERLAY: Biar teks tetep kebaca (Minimalist Teal Overlay) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#174143]/60 via-[#174143]/40 to-white" />
      </motion.div>

      {/* CONTENT LAYER: TEKS */}
      <motion.div 
        style={{ y: textY }}
        className="relative z-10 text-center px-6"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-[10px] font-black tracking-[0.5em] uppercase text-white/70 mb-6 px-6 py-2 border border-white/20 rounded-full backdrop-blur-md"
        >
          Kuliah Kerja Nyata Unpad 2026
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.85] drop-shadow-2xl"
        >
          Pabean <br /> 
          <span className="font-serif italic font-light opacity-100 leader-none">Udik.</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center font-bold text-[10px] uppercase tracking-[0.3em]"
        >
          <a href="#programs" className="px-10 py-5 bg-white text-[#174143] rounded-full hover:scale-110 transition-transform">
            Explore Program
          </a>
        </motion.div>
      </motion.div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white to-white/0 opacity-20" />
      </div>
    </section>
  );
}