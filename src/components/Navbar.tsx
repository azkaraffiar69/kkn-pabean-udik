"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Background berubah jadi putih solid setelah scroll > 50px
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Team", href: "#team" },
    { name: "Programs", href: "#programs" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? "py-4 bg-white border-b border-gray-100 shadow-md" // Background putih solid saat scroll
          : "py-6 md:py-8 bg-transparent" // Transparan saat di atas hero
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO: Tetap rata baseline dan ukuran seimbang */}
        <Link href="/" className="group">
          <div className={`flex items-baseline gap-2 transition-colors duration-500 ${
            scrolled ? "text-[#174143]" : "text-white"
          }`}>
            <span className="font-black text-xl tracking-tighter leader-none">
              Pabean
            </span>
            <span className={`font-serif italic text-[1.2rem] font-light transition-opacity leader-none ${
              scrolled ? "text-[#174143] opacity-100" : "text-white opacity-100"
            }`}>
              Udik
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
                scrolled 
                  ? "text-[#174143]/60 hover:text-[#174143]" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/login" 
            className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
              scrolled 
                ? "bg-[#174143] text-white hover:brightness-110 shadow-lg shadow-[#174143]/10" 
                : "bg-white text-[#174143] hover:bg-gray-100"
            }`}
          >
            Admin
          </Link>
        </div>

        {/* MOBILE TRIGGER: Ikon berubah warna sesuai scroll */}
        <button 
          className={`md:hidden p-2 z-[110] transition-colors duration-500 ${
            (isOpen || scrolled) ? "text-[#174143]" : "text-white"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE OVERLAY: Diberi bg-white solid agar tidak tembus pandang */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-white z-[105] md:hidden px-8 py-24 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-10 mt-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-5xl font-black tracking-tighter text-[#174143] flex items-center gap-4"
                >
                  {link.name} <span className="w-2 h-2 bg-[#174143] rounded-full" />
                </Link>
              ))}
            </div>
            
            <Link 
              href="/login"
              onClick={() => setIsOpen(false)}
              className="bg-[#174143] text-white p-6 rounded-[2rem] text-center font-bold uppercase tracking-widest text-xs shadow-2xl"
            >
              Admin Access
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}