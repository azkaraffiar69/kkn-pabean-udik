"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // Sudah ada di package.json kamu
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efek perubahan background saat scroll
  useEffect(() => {
    const handleScroll = () => {
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? "py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm" 
          : "py-8 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="group">
          <div className="font-black text-xl tracking-tighter text-[#174143] uppercase flex items-center gap-2">
            PABEAN <span className="opacity-20 italic font-serif group-hover:opacity-100 transition-opacity">UDIK</span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#174143]/60 hover:text-[#174143] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/login" 
            className="bg-[#174143] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-125 transition-all"
          >
            Admin
          </Link>
        </div>

        {/* MOBILE TRIGGER */}
        <button 
          className="md:hidden text-[#174143] p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] bg-white z-[90] md:hidden px-6 py-10"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-black tracking-tighter text-[#174143] hover:font-serif hover:italic"
                >
                  {link.name}.
                </Link>
              ))}
              <hr className="border-gray-100" />
              <Link 
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-[#174143]/40"
              >
                Admin Access
              </Link>
            </div>
            
            <div className="absolute bottom-12 left-6">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
                Unpad KKN 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}