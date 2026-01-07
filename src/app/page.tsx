import { getMembers, getKegiatan, getGallery, getConfig } from "@/app/actions";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MemberCarousel from "@/components/MemberCarousel";
import ExpandableSection from "@/components/ExpandableSection";
import StatsSection from "@/components/StatsSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let allMembers: any[] = [];
  let allProjects: any[] = [];
  let allPhotos: any[] = [];
  let configData: any = null;
  let hasError = false;

  try {
    const [membersData, kegiatanData, galleryData, config] = await Promise.all([
      getMembers(),
      getKegiatan(),
      getGallery(),
      getConfig() 
    ]);
    allMembers = membersData || [];
    allProjects = kegiatanData || [];
    allPhotos = galleryData || [];
    configData = config || null;
  } catch (error) {
    console.error("Database connection failed:", error);
    hasError = true;
  }

  return (
    <main className="min-h-screen bg-white selection:bg-[#174143] selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* --- SECTION: PERSONNEL (TIM KKN) --- */}
      <section id="team" className="py-20 md:py-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-6 mb-8 md:mb-12">
          <div className="max-w-xl">
            <h2 className="text-[2.5rem] md:text-6xl font-black tracking-tighter text-[#174143] leading-[1.1] mb-6">
              Meet <span className="font-serif italic font-light block md:inline text-[3rem] md:text-7xl">The Team.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base border-l-2 border-[#174143]/10 pl-4 md:pl-6 max-w-md leading-relaxed">
              Sinergi mahasiswa Universitas Padjadjaran lintas disiplin ilmu untuk pemberdayaan masyarakat Desa Pabean Udik.
            </p>
          </div>
        </div>

        {allMembers.length === 0 ? (
          <p className="text-center italic text-gray-300">Roster is empty...</p>
        ) : (
          <MemberCarousel data={allMembers} />
        )}
      </section>

      {/* --- SECTION: PROGRAM KERJA --- */}
      <section id="programs" className="bg-[#F9F9F9] py-16 md:py-20 px-5 md:px-6 rounded-[2.5rem] md:rounded-[5rem] mx-2 md:mx-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-24 text-center md:text-left">
            <h2 className="text-[2.5rem] md:text-6xl font-serif italic font-light tracking-tighter text-[#174143] leading-[1.1] mb-4">
              Work <span className="font-serif italic font-light block md:inline text-[3rem] md:text-7xl">Programs.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg">Inovasi nyata untuk pemberdayaan masyarakat berkelanjutan.</p>
          </div>
          
          {allProjects.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-gray-400 italic text-sm">Belum ada program kerja.</p>
            </div>
          ) : (
            <ExpandableSection items={allProjects} type="programs" />
          )}
        </div>
      </section>

      {/* --- SECTION: STATS (PROGRESS PER PROKER & COUNTDOWN) --- */}
      <section className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20">
        {configData ? (
          <StatsSection config={configData} prokers={allProjects} />
        ) : (
          <div className="h-40 bg-gray-50 rounded-[3rem] animate-pulse flex items-center justify-center text-gray-300 italic text-sm">
            Loading project stats...
          </div>
        )}
      </section>

      {/* --- SECTION: GALLERY --- */}
      <section id="gallery" className="py-16 md:py-40 max-w-7xl mx-auto px-5">
        <div className="mb-10 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[2.5rem] md:text-5xl font-black tracking-tighter text-[#174143]">Gallery.</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-lg">Visualisasi dedikasi dan kebersamaan.</p>
          </div>
          <p className="text-[#174143]/10 font-black text-6xl hidden sm:block select-none italic">2026</p>
        </div>
        
        {allPhotos.length === 0 ? (
          <p className="text-center py-16 italic text-gray-300">Dokumentasi belum tersedia.</p>
        ) : (
          <ExpandableSection items={allPhotos} type="gallery" />
        )}
      </section>

      {/* --- SECTION: CONTACT & MAPS --- */}
      <section id="contact" className="py-16 md:py-40 bg-white px-5 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-32 items-center">
          
          <div className="order-2 lg:order-1">
            <h2 className="text-[2.5rem] md:text-5xl font-black tracking-tighter text-[#174143] mb-12 leading-none uppercase italic">
              Get in <br />
              <span className="font-serif font-light lowercase opacity-40">Touch.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="flex gap-4 md:gap-6 items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#174143] text-white rounded-xl flex items-center justify-center flex-shrink-0 font-black italic shadow-lg">L</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Lokasi Posko</p>
                  <p className="text-[#174143] font-bold text-sm md:text-base leading-tight">Balai Desa Pabean Udik, Indramayu</p>
                </div>
              </div>

              <a href="mailto:kknpabeanudik26@gmail.com" className="flex gap-4 md:gap-6 items-start group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-[#174143] rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100 group-hover:bg-[#174143] group-hover:text-white transition-all duration-500 font-black italic">E</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Surel Resmi</p>
                  <p className="text-[#174143] font-bold text-sm md:text-base break-all">kknpabeanudik26@gmail.com</p>
                </div>
              </a>

              <a href="https://instagram.com/kknpabeanudik.26" target="_blank" className="flex gap-4 md:gap-6 items-start group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-[#174143] rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100 group-hover:bg-[#174143] group-hover:text-white transition-all duration-500 font-black italic">I</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Instagram</p>
                  <p className="text-[#174143] font-bold text-sm md:text-base">@kknpabeanudik.26</p>
                </div>
              </a>

              <a href="https://tiktok.com/@kkndesapabeanudik26" target="_blank" className="flex gap-4 md:gap-6 items-start group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-[#174143] rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100 group-hover:bg-[#174143] group-hover:text-white transition-all duration-500 font-black italic">T</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">TikTok</p>
                  <p className="text-[#174143] font-bold text-sm md:text-base">@kkndesapabeanudik26</p>
                </div>
              </a>
            </div>
          </div>

          {/* GOOGLE MAPS SECTION */}
          <div className="order-1 lg:order-2 h-[450px] bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-[#174143]/5 relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.918991726053!2d108.3300!3d-6.3200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6eb94910!2sPabean%20Udik%2C%20Pasekan%2C%20Indramayu%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            ></iframe>
            
            {/* Overlay Label */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-100 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#174143]">Pabean Udik, Indramayu</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 md:py-32 text-center border-t border-gray-50 bg-white">
        <div className="font-black text-2xl md:text-4xl tracking-tighter text-[#174143] uppercase mb-6">
          PABEAN <span className="opacity-100 italic font-serif font-light lowercase">udik '26</span>
        </div>
        <p className="text-[8px] md:text-[10px] font-bold tracking-[0.5em] uppercase text-[#174143]/20 leading-loose">
          Universitas Padjadjaran • Kuliah Kerja Nyata
        </p>
      </footer>
      
      {hasError && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full text-[9px] font-black uppercase z-[300] animate-bounce shadow-2xl">
          System Error
        </div>
      )}
    </main>
  );
}