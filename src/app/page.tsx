import { getMembers, getKegiatan, getGallery } from "@/app/actions";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MemberCarousel from "@/components/MemberCarousel";
import login from "@/app/actions"

// Konfigurasi Server: Selalu ambil data terbaru
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let allMembers = [];
  let allProjects = []; 
  let allPhotos = [];
  let hasError = false;

  try {
    // Pengambilan data paralel untuk efisiensi
    const [membersData, kegiatanData, galleryData] = await Promise.all([
      getMembers(),
      getKegiatan(),
      getGallery()
    ]);
    
    allMembers = membersData;
    allProjects = kegiatanData; 
    allPhotos = galleryData;
  } catch (error) {
    console.error("Database connection failed:", error);
    hasError = true;
  }

  return (
    <main className="min-h-screen bg-white selection:bg-[#174143] selection:text-white">
      <Navbar />
      <Hero />

      {/* --- SECTION: PERSONNEL (TIM KKN) --- */}
      <section id="team" className="max-w-7xl mx-auto px-6 py-40 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-xl">
            <h2 className="text-6xl font-black tracking-tighter text-[#174143] leading-none mb-8">
              Meet <span className="font-serif italic font-light opacity-100 Keading-none -7xl"> The Team.</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed border-l-2 border-[#174143]/10 pl-6">
              Sinergi mahasiswa Universitas Padjadjaran lintas disiplin ilmu untuk pemberdayaan masyarakat Desa Pabean Udik.
            </p>
          </div>
        </div>

        {allMembers.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-gray-100 rounded-[4rem] text-center bg-gray-50/50">
            <p className="text-gray-400 font-serif italic text-lg">Roster is empty...</p>
          </div>
        ) : (
          <MemberCarousel data={allMembers} />
        )}
      </section>

      {/* --- SECTION: PROGRAM KERJA (WORK PROGRAMS) --- */}
      <section id="programs" className="bg-[#F9F9F9] py-40 px-6 rounded-[5rem] mx-4 md:mx-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24 text-center md:text-left">
           <h2 className="text-6xl font-black tracking-tighter text-[#174143] leading-none mb-8">
              Work <span className="font-serif italic font-light opacity-100 leading-none text-7xl"> Programs.</span>
            </h2>
            <p className="text-gray-400 text-lg">Transformasi digital dan pemberdayaan berkelanjutan.</p>
          </div>

          {allProjects.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100">
              <p className="text-gray-400 italic">Belum ada program kerja yang terdaftar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {allProjects.map((project) => (
                <div key={project.id} className="group flex flex-col">
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-[3.5rem] mb-10 bg-gray-200 shadow-2xl shadow-gray-200/40 relative">
                    <img 
                      src={project.imageUrl || "/placeholder-kegiatan.jpg"} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  
                  <div className="px-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-[1px] w-8 bg-[#174143]/20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#174143]/40">Program Unggulan</span>
                    </div>
                    <h3 className="text-4xl font-black text-[#174143] mb-6 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm lg:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION: DOKUMENTASI (GALLERY) --- */}
      <section id="gallery" className="py-40 max-w-7xl mx-auto px-6">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-[#174143]">Gallery.</h2>
            <p className="text-gray-400 mt-4 text-lg">Visualisasi dedikasi dan kebersamaan.</p>
          </div>
          <p className="text-[#174143]/20 font-black text-8xl leading-none hidden md:block select-none">2026</p>
        </div>

        {allPhotos.length === 0 ? (
          <p className="text-gray-400 italic text-center py-20">Foto dokumentasi belum tersedia.</p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {allPhotos.map((photo) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-[3rem] border border-gray-100 shadow-sm break-inside-avoid isolate">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption || "Dokumentasi KKN"} 
                  className="w-full h-auto object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#174143] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-10">
                    <p className="text-white text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SECTION: CONTACT & LOCATION --- */}
      <section id="contact" className="py-40 bg-white px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-[#174143] mb-10 leading-none">Get in <br /><span className="font-serif italic font-light opacity-40 lowercase">Touch.</span></h2>
            <p className="text-gray-500 mb-16 leading-relaxed max-w-md">
              Terbuka untuk diskusi, kolaborasi, atau pertanyaan seputar inisiatif kami di Pabean Udik.
            </p>
            
            <div className="space-y-12">
              <div className="group flex gap-8 items-start">
                <div className="w-14 h-14 bg-[#174143] text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-[#174143]/20 group-hover:-rotate-12 transition-transform">
                  <span className="font-black italic">L</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">Lokasi Posko</p>
                  <p className="text-[#174143] font-bold text-xl">Balai Desa Pabean Udik, <br />Indramayu, Jawa Barat</p>
                </div>
              </div>
              
              <div className="group flex gap-8 items-start">
                <div className="w-14 h-14 bg-gray-50 text-[#174143] rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 group-hover:rotate-12 transition-transform">
                  <span className="font-black italic">E</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">Surel Resmi</p>
                  <p className="text-[#174143] font-bold text-lg underline underline-offset-8 decoration-gray-200 hover:decoration-[#174143] transition-colors">
                    pabeanudik26@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[600px] bg-gray-50 rounded-[4rem] overflow-hidden border border-gray-100 shadow-3xl relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.419024090258!2d108.3184614!3d-6.3155319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6eb942f36d4e5d%3A0xc38e55e56e0d37e6!2sPabeanudik%2C%20Kec.%20Indramayu%2C%20Kabupaten%20Indramayu%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-1000"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 text-center border-t border-gray-50 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="font-black text-4xl tracking-tighter text-[#174143] uppercase mb-12">
            PABEAN <span className="opacity-100 italic font-serif font-light lowercase">Udik '26</span>
          </div>
          <div className="h-[1px] w-24 bg-gray-100 mx-auto mb-12" />
          <p className="text-[10px] font-bold tracking-[0.8em] uppercase text-[#174143]/20 leading-loose">
            Universitas Padjadjaran • Kuliah Kerja Nyata <br />
            Kabupaten Indramayu • Jawa Barat
          </p>
        </div>
      </footer>
      
      {/* ERROR INDICATOR */}
      {hasError && (
        <div className="fixed bottom-10 right-10 bg-red-600 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-50 animate-bounce">
          System Connection Error
        </div>
      )}
    </main>
  );
}