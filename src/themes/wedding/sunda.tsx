"use client";

import { useEffect, useState, useRef } from "react";
import type { ThemeProps } from "@/lib/types";
import Image from "next/image";
import { Play, Pause, MapPin, Calendar, Gift, Heart } from "lucide-react";

export default function SundaTheme({ data, guestName }: ThemeProps & { guestName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.musicUrl) {
      const a = new Audio(data.musicUrl);
      a.loop = true;
      setAudio(a);
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [data.musicUrl]);

  const toggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleOpen = () => {
    setIsOpened(true);
    if (audio && !isPlaying) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#54463a] font-sans overflow-x-hidden selection:bg-[#978864] selection:text-white relative">
      
      {/* Background Floral Illustration - Full Visibility */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />

      {/* Audio Control */}
      {data.features?.music && data.musicUrl && isOpened && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#3e342a] text-[#f7f4ed] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* ═══════════ COVER SECTION ═══════════ */}
        <section className="min-h-[100svh] w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 text-center pt-32 relative">
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-1000">
            <p className="text-[#866d4b] uppercase tracking-[0.2em] text-xs font-semibold">Wedding Invitation</p>
            <h1 className="text-5xl md:text-6xl font-normal mt-2 mb-4 font-[family-name:var(--font-script)] text-[#54463a]">
              {data.couple.person1.name} <br/> <span className="text-[#866d4b] text-4xl">&</span> <br/> {data.couple.person2.name}
            </h1>
            
            {data.events[0] && (
              <p className="text-sm font-bold tracking-widest text-[#54463a]">
                {data.events[0].date}
              </p>
            )}

            <div className="mt-12 pt-8 border-t border-[#866d4b]/30 space-y-3">
              <p className="text-xs text-[#54463a] uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <h2 className="text-xl font-bold text-[#866d4b] font-[family-name:var(--font-display)]">{guestName || data.guest.name}</h2>
            </div>

            {/* Button disappears when opened */}
            <div className={`transition-all duration-700 ${isOpened ? 'opacity-0 scale-90 pointer-events-none h-0 overflow-hidden' : 'opacity-100 scale-100 h-20'}`}>
              <button 
                onClick={handleOpen}
                className="mt-10 px-8 py-3 bg-[#3e342a] text-[#f8f5f0] font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-[#866d4b] transition-colors shadow-xl mx-auto flex items-center gap-2 animate-bounce"
              >
                Buka Undangan
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════ INNER CONTENT (after open) ═══════════ */}
        <div ref={contentRef} className={`w-full flex flex-col items-center transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible h-0 overflow-hidden'}`}>
          
          {/* ─── Quote Section (with brown card) ─── */}
          <section className="w-full max-w-lg mx-auto px-5 py-10">
            <div className="bg-[#a08860]/80 backdrop-blur-sm rounded-3xl p-8 text-center space-y-6 shadow-lg border border-[#866d4b]/30">
              <h2 className="text-5xl font-[family-name:var(--font-script)] text-white/90">
                {data.couple.person1.name.charAt(0)} & {data.couple.person2.name.charAt(0)}
              </h2>
              <p className="text-sm italic text-white/90 leading-relaxed font-serif">
                &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.&rdquo;
              </p>
              <p className="text-white font-bold tracking-widest uppercase text-xs">QS. Ar-Rum : 21</p>
            </div>
          </section>

          {/* ─── The Bride & The Groom (with arch card) ─── */}
          <section className="w-full max-w-lg mx-auto px-5 py-6">
            <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[120px] rounded-b-3xl p-8 pt-16 text-center shadow-lg border-2 border-[#866d4b]/30">
              <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-2">The Bride & The Groom</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-[#54463a] font-bold mb-4">Assalamu&apos;alaikum Wr. Wb.</p>
              <p className="text-[#54463a] text-sm leading-relaxed px-2 mb-12">
                Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan putra-putri kami:
              </p>
              
              <div className="space-y-14">
                {/* Person 1 */}
                <div className="space-y-5">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-[6px] border-white shadow-xl relative">
                    <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Person 1" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#866d4b]">{data.couple.person1.name}</h3>
                    <p className="text-sm font-bold text-[#54463a] mt-2">{data.couple.person1.fullName}</p>
                    <p className="text-xs text-[#54463a]/80 mt-1 whitespace-pre-wrap leading-relaxed">{data.couple.person1.parents}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-20 bg-[#866d4b]/30" />
                  <span className="text-4xl font-[family-name:var(--font-script)] text-[#866d4b]">&</span>
                  <div className="h-px w-20 bg-[#866d4b]/30" />
                </div>
                
                {/* Person 2 */}
                <div className="space-y-5">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-[6px] border-white shadow-xl relative">
                    <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Person 2" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#866d4b]">{data.couple.person2.name}</h3>
                    <p className="text-sm font-bold text-[#54463a] mt-2">{data.couple.person2.fullName}</p>
                    <p className="text-xs text-[#54463a]/80 mt-1 whitespace-pre-wrap leading-relaxed">{data.couple.person2.parents}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Events Section (with arch card) ─── */}
          <section className="w-full max-w-lg mx-auto px-5 py-6">
            <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[120px] rounded-b-3xl p-8 pt-16 text-center shadow-lg border-2 border-[#866d4b]/30">
              <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-12">Rangkaian Acara</h2>
              
              <div className="space-y-8">
                {data.events.map((event, idx) => (
                  <div key={idx} className="bg-white/70 border border-[#866d4b]/20 p-6 rounded-2xl shadow-sm text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-[#866d4b]" />
                    
                    <h3 className="text-lg font-bold tracking-widest text-[#54463a] uppercase mb-5">{event.name}</h3>
                    
                    <div className="space-y-3 text-[#54463a] text-sm">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Calendar className="w-5 h-5 text-[#866d4b] mb-1" />
                        <p className="font-bold text-base">{event.date}</p>
                        <p className="text-xs px-3 py-1 bg-[#f8f5f0] rounded-full border border-[#866d4b]/20">{event.time}</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center gap-2 pt-3 border-t border-[#866d4b]/20 mt-3">
                        <MapPin className="w-5 h-5 text-[#866d4b]" />
                        <p className="font-bold">{event.venue}</p>
                        <p className="text-xs leading-relaxed italic opacity-80">{event.address}</p>
                      </div>
                    </div>

                    {data.features?.maps && event.mapsUrl && (
                      <a 
                        href={event.mapsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-6 inline-block px-7 py-2.5 bg-[#3e342a] text-[#f7f4ed] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#866d4b] transition-colors"
                      >
                        Buka Peta Lokasi
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Gallery Section (with arch card) ─── */}
          {data.features?.gallery && data.gallery.length > 0 && (
            <section className="w-full max-w-lg mx-auto px-5 py-6">
              <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[120px] rounded-b-3xl p-8 pt-16 text-center shadow-lg border-2 border-[#866d4b]/30">
                <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-10">Galeri Kami</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {data.gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-[4/5] overflow-hidden rounded-xl border-4 border-white shadow-md bg-gray-100">
                      <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─── Gift Section (with arch card) ─── */}
          {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
            <section className="w-full max-w-lg mx-auto px-5 py-6">
              <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[120px] rounded-b-3xl p-8 pt-16 text-center shadow-lg border-2 border-[#866d4b]/30">
                <Gift className="w-10 h-10 text-[#866d4b] mx-auto mb-4" />
                <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-3">Tanda Kasih</h2>
                <p className="text-[#54463a] text-xs leading-relaxed mb-8 px-2">
                  Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi kami. 
                  Bagi yang ingin memberikan tanda kasih, dapat melalui:
                </p>
                
                <div className="space-y-5">
                  {data.giftInfo.bankAccounts.map((bank, idx) => (
                    <div key={idx} className="bg-white/80 p-6 rounded-2xl border border-[#866d4b]/20 shadow-sm">
                      <p className="text-lg font-bold text-[#866d4b] uppercase tracking-widest">{bank.bank}</p>
                      <p className="text-2xl font-mono text-[#3e342a] my-2">{bank.number}</p>
                      <p className="text-xs text-[#54463a] uppercase font-bold border-t border-[#866d4b]/20 pt-3 mt-2">A.N. {bank.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─── Footer ─── */}
          <footer className="w-full max-w-lg mx-auto px-5 py-10 text-center">
            <div className="bg-[#faf7f2]/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#866d4b]/20">
              <p className="mb-4 italic text-sm text-[#54463a]">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
              <p className="font-bold text-[#3e342a] text-base mb-6">Wassalamu&apos;alaikum Wr. Wb.</p>
              <p className="text-xs text-[#54463a]/50">Made with ♥️ by Momena Labs</p>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
