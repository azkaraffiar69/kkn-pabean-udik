"use client";

import { login } from "@/app/actions"; // Menggunakan alias @ untuk memastikan Turbopack menemukan module
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    // Mengambil password dari input form
    const password = formData.get("password") as string;

    try {
      // Memanggil fungsi login di actions.ts
      const result = await login(password);

      if (result.success) {
        // Jika berhasil, arahkan ke halaman admin
        router.push("/admin");
      } else {
        // Jika gagal, tampilkan pesan error dari server
        setError(result.message || "Akses Ditolak");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6 selection:bg-[#174143] selection:text-white">
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

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-[10px] font-bold uppercase text-center tracking-widest"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#174143] text-white p-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:brightness-125 transition-all shadow-lg shadow-[#174143]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Authorize Access"}
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