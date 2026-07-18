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
    if (isPlaying) { audio.pause(); } else { audio.play(); }
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
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#54463a] font-sans selection:bg-[#978864] selection:text-white">
      
      {/* Audio Control */}
      {data.features?.music && data.musicUrl && isOpened && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#3e342a] text-[#f7f4ed] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      <div className="flex flex-col md:flex-row min-h-screen">

        {/* ═══════════ LEFT PANEL — Fixed Couple Photo (Desktop Only) ═══════════ */}
        <div className="hidden md:flex md:w-[55%] lg:w-[60%] fixed left-0 top-0 bottom-0 flex-col items-center justify-end overflow-hidden">
          <Image 
            src={data.coverPhoto || "/images/themes/sunda-thumb.png"} 
            alt="Couple Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          
          <div className="relative z-10 text-center text-white pb-16 px-8">
            <p className="text-xs uppercase tracking-[0.25em] mb-3 font-medium opacity-80">The Wedding of</p>
            <h1 className="text-5xl lg:text-7xl font-[family-name:var(--font-display)] drop-shadow-lg leading-tight">
              {data.couple.person1.name} & {data.couple.person2.name}
            </h1>
            {data.events[0] && (
              <p className="mt-4 text-sm font-medium tracking-widest opacity-80">
                {data.events[0].date}
              </p>
            )}
          </div>
        </div>

        {/* ═══════════ RIGHT PANEL — Scrollable Content ═══════════ */}
        <div className="w-full md:w-[45%] lg:w-[40%] md:ml-auto min-h-screen relative">
          
          {/* Floral Background */}
          <div 
            className="fixed top-0 right-0 w-full md:w-[45%] lg:w-[40%] h-full z-0 pointer-events-none"
            style={{
              backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          <div className="relative z-10">

            {/* ─── Cover / Buka Undangan ─── */}
            <section className="min-h-[100svh] flex flex-col items-center justify-center p-6 text-center relative">
              {/* Mobile Hero Image */}
              <div className="md:hidden absolute inset-0 z-[-1]">
                <Image src={data.coverPhoto || "/images/themes/sunda-thumb.png"} alt="Cover" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#f8f5f0]" />
              </div>

              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-1000 mt-auto mb-auto">
                <p className="text-[#866d4b] md:text-[#866d4b] text-xs uppercase tracking-[0.2em] font-semibold drop-shadow-sm">
                  <span className="md:hidden text-white/80">The Wedding of</span>
                  <span className="hidden md:inline">Wedding Invitation</span>
                </p>
                <h1 className="text-5xl font-normal font-[family-name:var(--font-script)] md:text-[#54463a] text-white drop-shadow-md">
                  {data.couple.person1.name} <br/> 
                  <span className="text-[#866d4b] text-3xl md:text-[#866d4b]">&</span> <br/> 
                  {data.couple.person2.name}
                </h1>

                {data.events[0] && (
                  <p className="text-sm font-bold tracking-widest md:text-[#54463a] text-white/80">
                    {data.events[0].date}
                  </p>
                )}

                <div className="mt-10 pt-6 border-t border-[#866d4b]/30 space-y-2">
                  <p className="text-xs md:text-[#54463a] text-white/70 uppercase tracking-widest">Kepada Yth.</p>
                  <h2 className="text-xl font-bold text-[#866d4b] font-[family-name:var(--font-display)]">{guestName || data.guest.name}</h2>
                </div>

                <div className={`transition-all duration-700 ${isOpened ? 'opacity-0 scale-90 pointer-events-none h-0 overflow-hidden' : 'opacity-100 scale-100 h-16 mt-6'}`}>
                  <button 
                    onClick={handleOpen}
                    className="px-8 py-3 bg-[#3e342a] text-[#f8f5f0] font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-[#866d4b] transition-colors shadow-xl mx-auto flex items-center gap-2 animate-bounce"
                  >
                    Buka Undangan
                  </button>
                </div>
              </div>
            </section>

            {/* ═══════════ INNER CONTENT (after open) ═══════════ */}
            <div ref={contentRef} className={`w-full flex flex-col items-center transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible h-0 overflow-hidden'}`}>

              {/* ─── Quote Card (Brown/Tan) ─── */}
              <section className="w-full px-4 py-8">
                <div className="bg-[#a08860]/85 backdrop-blur-sm rounded-3xl p-8 text-center space-y-5 shadow-lg border border-[#866d4b]/30">
                  <h2 className="text-5xl font-[family-name:var(--font-script)] text-white/90">
                    {data.couple.person1.name.charAt(0)} & {data.couple.person2.name.charAt(0)}
                  </h2>
                  <p className="text-sm italic text-white/90 leading-relaxed font-serif">
                    &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.&rdquo;
                  </p>
                  <p className="text-white font-bold tracking-widest uppercase text-xs">QS. Ar-Rum : 21</p>
                </div>
              </section>

              {/* ─── The Bride & The Groom (Arch Card) ─── */}
              <section className="w-full px-4 py-4">
                <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[100px] rounded-b-3xl p-6 pt-14 text-center shadow-lg border-2 border-[#866d4b]/30">
                  <h2 className="text-2xl font-[family-name:var(--font-script)] text-[#866d4b] mb-1">The Bride & The Groom</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#54463a] font-bold mb-3">Assalamu&apos;alaikum Wr. Wb.</p>
                  <p className="text-[#54463a] text-xs leading-relaxed px-2 mb-10">
                    Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan putra-putri kami:
                  </p>
                  
                  {/* Person 1 */}
                  <div className="space-y-4 mb-8">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-[5px] border-white shadow-xl relative">
                      <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Person 1" fill className="object-cover" />
                    </div>
                    <h3 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b]">{data.couple.person1.name}</h3>
                    <p className="text-sm font-bold text-[#54463a]">{data.couple.person1.fullName}</p>
                    <p className="text-xs text-[#54463a]/80 whitespace-pre-wrap leading-relaxed">{data.couple.person1.parents}</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 my-6">
                    <div className="h-px w-16 bg-[#866d4b]/30" />
                    <span className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b]">&</span>
                    <div className="h-px w-16 bg-[#866d4b]/30" />
                  </div>
                  
                  {/* Person 2 */}
                  <div className="space-y-4 mt-8">
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-[5px] border-white shadow-xl relative">
                      <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Person 2" fill className="object-cover" />
                    </div>
                    <h3 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b]">{data.couple.person2.name}</h3>
                    <p className="text-sm font-bold text-[#54463a]">{data.couple.person2.fullName}</p>
                    <p className="text-xs text-[#54463a]/80 whitespace-pre-wrap leading-relaxed">{data.couple.person2.parents}</p>
                  </div>
                </div>
              </section>

              {/* ─── Events (Arch Card) ─── */}
              <section className="w-full px-4 py-4">
                <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[100px] rounded-b-3xl p-6 pt-14 text-center shadow-lg border-2 border-[#866d4b]/30">
                  <h2 className="text-2xl font-[family-name:var(--font-script)] text-[#866d4b] mb-8">Rangkaian Acara</h2>
                  
                  <div className="space-y-6">
                    {data.events.map((event, idx) => (
                      <div key={idx} className="bg-white/60 border border-[#866d4b]/15 p-5 rounded-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-[#866d4b]" />
                        <h3 className="text-sm font-bold tracking-widest text-[#54463a] uppercase mb-4">{event.name}</h3>
                        <div className="space-y-2 text-[#54463a] text-sm">
                          <Calendar className="w-4 h-4 text-[#866d4b] mx-auto" />
                          <p className="font-bold">{event.date}</p>
                          <p className="text-xs px-3 py-1 bg-[#f8f5f0] rounded-full border border-[#866d4b]/15 inline-block">{event.time}</p>
                          <div className="pt-3 border-t border-[#866d4b]/15 mt-3">
                            <MapPin className="w-4 h-4 text-[#866d4b] mx-auto mb-1" />
                            <p className="font-bold text-sm">{event.venue}</p>
                            <p className="text-xs italic opacity-80">{event.address}</p>
                          </div>
                        </div>
                        {data.features?.maps && event.mapsUrl && (
                          <a href={event.mapsUrl} target="_blank" rel="noreferrer"
                            className="mt-5 inline-block px-6 py-2 bg-[#3e342a] text-[#f7f4ed] font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#866d4b] transition-colors">
                            Buka Peta
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ─── Gallery (Arch Card) ─── */}
              {data.features?.gallery && data.gallery.length > 0 && (
                <section className="w-full px-4 py-4">
                  <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[100px] rounded-b-3xl p-6 pt-14 text-center shadow-lg border-2 border-[#866d4b]/30">
                    <h2 className="text-2xl font-[family-name:var(--font-script)] text-[#866d4b] mb-8">Galeri Kami</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {data.gallery.map((img, idx) => (
                        <div key={idx} className="relative aspect-[4/5] overflow-hidden rounded-lg border-[3px] border-white shadow-md">
                          <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ─── Gift (Arch Card) ─── */}
              {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
                <section className="w-full px-4 py-4">
                  <div className="bg-[#faf7f2]/95 backdrop-blur-sm rounded-t-[100px] rounded-b-3xl p-6 pt-14 text-center shadow-lg border-2 border-[#866d4b]/30">
                    <Gift className="w-8 h-8 text-[#866d4b] mx-auto mb-3" />
                    <h2 className="text-2xl font-[family-name:var(--font-script)] text-[#866d4b] mb-2">Tanda Kasih</h2>
                    <p className="text-[#54463a] text-xs leading-relaxed mb-6 px-2">
                      Bagi yang ingin memberikan tanda kasih, dapat melalui:
                    </p>
                    <div className="space-y-4">
                      {data.giftInfo.bankAccounts.map((bank, idx) => (
                        <div key={idx} className="bg-white/70 p-5 rounded-xl border border-[#866d4b]/20">
                          <p className="text-base font-bold text-[#866d4b] uppercase tracking-widest">{bank.bank}</p>
                          <p className="text-xl font-mono text-[#3e342a] my-2">{bank.number}</p>
                          <p className="text-[10px] text-[#54463a] uppercase font-bold border-t border-[#866d4b]/15 pt-2 mt-1">A.N. {bank.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ─── Footer ─── */}
              <footer className="w-full px-4 py-8 text-center">
                <div className="bg-[#faf7f2]/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-[#866d4b]/20">
                  <p className="mb-3 italic text-xs text-[#54463a]">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
                  <p className="font-bold text-[#3e342a] text-sm mb-4">Wassalamu&apos;alaikum Wr. Wb.</p>
                  <p className="text-[10px] text-[#54463a]/40">Made with ♥️ by Momena Labs</p>
                </div>
              </footer>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
