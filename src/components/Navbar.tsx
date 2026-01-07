"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Fungsi untuk mendeteksi scroll
    const handleScroll = () => {
      // Jika scroll lebih dari 50px, ubah status menjadi true
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md py-4 shadow-sm" 
          : "bg-transparent py-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        
        {/* LOGO: Berubah dari Putih ke Teal #174143 */}
        <div className={`font-black text-2xl tracking-tighter leading-none transition-colors duration-500 ${
          isScrolled ? "text-[#174143]" : "text-white"
        }`}>
          Pabean <span className={`font-serif italic font-light transition-opacity duration-500 ${isScrolled ? "opacity-20" : "opacity-50"}`}>Udik</span>
        </div>

        {/* MENU LINKS */}
        <div className="flex gap-10 items-center">
          {["Team", "Programs", "Gallery"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`text-[10px] font-black uppercase tracking-widest transition-all duration-500 hover:scale-110 ${
                isScrolled 
                  ? "text-[#174143]/60 hover:text-[#174143]" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}

          {/* BUTTON PORTAL: Berubah Style saat Scroll */}
          <a 
            href="/admin" 
            className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${
              isScrolled 
                ? "bg-[#174143] text-white shadow-lg shadow-[#174143]/20" 
                : "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white hover:text-[#174143]"
            }`}
          >
            Portal
          </a>
        </div>
      </div>
    </nav>
  );
}