"use client";
import { login } from "../actions";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await login(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <main className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="font-black text-2xl tracking-tighter text-[#174143] uppercase mb-2">
            PABEAN <span className="opacity-20 italic font-serif">UDIK</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
            Internal Command Center
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#174143]/5 border border-gray-100">
          <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#174143]/40 ml-1">
                Access Password
              </label>
              <input 
                name="password" 
                type="password"
                required
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#174143]/20 transition-all font-medium text-[#174143]"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center tracking-widest">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-[#174143] text-white p-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:brightness-125 transition-all shadow-lg shadow-[#174143]/10"
            >
              Authorize Access
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-[#174143]/20 hover:text-[#174143] transition-colors">
            ← Back to Public Site
          </a>
        </div>
      </motion.div>
    </main>
  );
}