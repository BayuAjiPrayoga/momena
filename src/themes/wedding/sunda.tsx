"use client";

import { useEffect, useState, useRef } from "react";
import type { ThemeProps } from "@/lib/types";
import Image from "next/image";
import { Play, Pause, MapPin, Calendar, Gift, Heart, ArrowDown } from "lucide-react";

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
    <div className="min-h-screen bg-[#f8f5f0] text-[#54463a] font-sans selection:bg-[#978864] selection:text-white relative">
      
      {/* Audio Control */}
      {data.features?.music && data.musicUrl && isOpened && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#9c7b4a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      {/* Outer Wrapper */}
      <div className="w-full min-h-screen lg:flex lg:justify-end">
        
        {/* Left Side (Desktop Only) - Fixed Photo */}
        <div className="hidden lg:flex lg:w-[calc(100%-430px)] fixed left-0 top-0 bottom-0 flex-col justify-end items-center text-center pb-24 z-0">
          <Image 
            src={data.coverPhoto || "/images/themes/sunda-thumb.png"} 
            alt="Cover" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10" />
          <div className="relative z-20 text-white space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] font-medium opacity-80">The Wedding of</p>
            <h1 className="text-6xl font-[family-name:var(--font-display)] drop-shadow-lg">
              {data.couple.person1.name} & {data.couple.person2.name}
            </h1>
            {data.events[0] && (
              <p className="text-sm font-medium tracking-widest opacity-80">
                {data.events[0].date}
              </p>
            )}
          </div>
        </div>

        {/* Right Side / Main Mobile Content */}
        <div className="w-full lg:w-[430px] md:max-w-[430px] mx-auto lg:mx-0 bg-white min-h-screen relative shadow-2xl overflow-hidden z-10">
        
        {/* Floral Background - Fixed behind content */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundAttachment: "fixed" // keep fixed so it doesn't scroll
          }}
        />

        <div className="relative z-10">

          {/* ─── HERO COVER ─── */}
          <section className="min-h-[100svh] flex flex-col relative">
            {/* Top Photo Background */}
            <div className="absolute top-0 left-0 w-full h-[60%] z-0">
              <Image 
                src={data.coverPhoto || "/images/themes/sunda-thumb.png"} 
                alt="Cover" 
                fill 
                className="object-cover object-top" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Bottom Arch Content */}
            <div className="mt-auto relative z-10 w-full px-4 pb-8">
              <div className="bg-[#fcfaf7] rounded-t-[100px] rounded-b-xl shadow-xl border-t-[6px] border-x-[6px] border-[#9c7b4a]/20 pt-16 pb-10 px-6 text-center">
                <p className="text-[#9c7b4a] text-[10px] uppercase tracking-[0.3em] font-medium mb-3">
                  The Wedding of
                </p>
                <h1 className="text-4xl font-[family-name:var(--font-script)] text-[#54463a] mb-2 leading-snug">
                  {data.couple.person1.name} <br/>
                  <span className="text-[#9c7b4a] text-2xl">&</span> <br/>
                  {data.couple.person2.name}
                </h1>
                
                {data.events[0] && (
                  <p className="text-xs font-bold tracking-[0.2em] text-[#54463a] my-4">
                    {data.events[0].date}
                  </p>
                )}

                <div className="my-8 space-y-2">
                  <p className="text-[10px] text-[#54463a] uppercase tracking-widest opacity-70">Kepada Yth.</p>
                  <h2 className="text-lg font-bold text-[#9c7b4a] font-[family-name:var(--font-display)]">
                    {guestName || data.guest.name}
                  </h2>
                </div>

                <div className={`transition-all duration-700 ${isOpened ? 'opacity-0 scale-90 pointer-events-none h-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
                  <button 
                    onClick={handleOpen}
                    className="px-8 py-3 bg-[#9c7b4a] text-white font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-[#836338] transition-colors shadow-lg mx-auto flex items-center gap-2 animate-bounce"
                  >
                    Buka Undangan
                  </button>
                </div>
              </div>
            </div>
          </section>


          {/* ═══════════ INNER CONTENT (after open) ═══════════ */}
          <div ref={contentRef} className={`w-full flex flex-col items-center transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible h-0 overflow-hidden'}`}>
            
            {/* ─── Main Greeting (Large Arch) ─── */}
            <section className="w-full px-5 py-6 min-h-[100svh] flex flex-col justify-center">
              <div className="bg-[#fcfaf7]/95 backdrop-blur-sm rounded-t-[200px] rounded-b-[200px] border-4 border-[#9c7b4a]/20 p-8 py-20 text-center shadow-md relative flex-grow flex flex-col items-center justify-center min-h-[85svh]">
                {/* Optional decorative lines */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-[#9c7b4a]/30 rounded-full" />
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-[#9c7b4a]/30 rounded-full" />

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#54463a] mb-8">Wedding Invitation</p>
                <h2 className="text-6xl font-[family-name:var(--font-script)] text-[#9c7b4a] mb-6 leading-tight">
                  {data.couple.person1.name} <br/> 
                  <span className="text-3xl text-[#54463a] block my-2">&</span>
                  {data.couple.person2.name}
                </h2>
                {data.events[0] && (
                  <p className="text-xs font-bold tracking-[0.3em] text-[#54463a] mt-8">
                    {data.events[0].date}
                  </p>
                )}
                
                <div className="mt-16 w-8 h-12 border border-[#54463a] rounded-full mx-auto flex items-center justify-center animate-bounce">
                  <ArrowDown className="w-4 h-4 text-[#54463a]" />
                </div>
              </div>
            </section>

            {/* ─── Quote Card (Brown Box) ─── */}
            <section className="w-full px-5 py-6">
              <div className="bg-[#9c7b4a] rounded-xl p-8 text-center text-white shadow-lg">
                <h3 className="text-3xl font-[family-name:var(--font-script)] mb-4">
                  {data.couple.person1.name.charAt(0)} & {data.couple.person2.name.charAt(0)}
                </h3>
                <p className="text-[11px] leading-relaxed mb-4 opacity-90">
                  &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.&rdquo;
                </p>
                <p className="text-[10px] font-bold tracking-widest uppercase">QS. Ar-Rum : 21</p>
              </div>
            </section>

            {/* ─── Bride & Groom (Pill Shape) ─── */}
            <section className="w-full px-5 py-6">
              <div className="bg-[#fcfaf7]/95 backdrop-blur-sm rounded-t-[140px] rounded-b-[140px] border-4 border-[#9c7b4a]/20 p-6 py-16 text-center shadow-md">
                
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#54463a] mb-2">The Bride & The Groom</p>
                <p className="text-[9px] uppercase tracking-widest text-[#9c7b4a] mb-4">Assalamu'alaikum Wr. Wb.</p>
                <p className="text-xs text-[#54463a] leading-relaxed px-4 mb-10 opacity-90">
                  Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan putra-putri kami:
                </p>

                {/* Bride */}
                <div className="space-y-4 mb-10">
                  <div className="w-40 h-48 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-md relative">
                    <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Bride" fill className="object-cover" />
                  </div>
                  <h3 className="text-3xl font-[family-name:var(--font-script)] text-[#9c7b4a]">{data.couple.person2.name}</h3>
                  <p className="text-xs font-bold text-[#54463a]">{data.couple.person2.fullName}</p>
                  <p className="text-[10px] text-[#54463a]/70 whitespace-pre-wrap leading-relaxed">{data.couple.person2.parents}</p>
                  <a href="#" className="inline-block px-4 py-1.5 bg-[#9c7b4a] text-white text-[10px] rounded-full mt-2">@instagram</a>
                </div>

                <div className="flex items-center justify-center gap-4 my-8">
                  <div className="h-px w-12 bg-[#9c7b4a]/40" />
                  <span className="text-3xl font-[family-name:var(--font-script)] text-[#9c7b4a]">&</span>
                  <div className="h-px w-12 bg-[#9c7b4a]/40" />
                </div>

                {/* Groom */}
                <div className="space-y-4">
                  <div className="w-40 h-48 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-md relative">
                    <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Groom" fill className="object-cover" />
                  </div>
                  <h3 className="text-3xl font-[family-name:var(--font-script)] text-[#9c7b4a]">{data.couple.person1.name}</h3>
                  <p className="text-xs font-bold text-[#54463a]">{data.couple.person1.fullName}</p>
                  <p className="text-[10px] text-[#54463a]/70 whitespace-pre-wrap leading-relaxed">{data.couple.person1.parents}</p>
                  <a href="#" className="inline-block px-4 py-1.5 bg-[#9c7b4a] text-white text-[10px] rounded-full mt-2">@instagram</a>
                </div>

              </div>
            </section>

            {/* ─── Separator Photo & Countdown ─── */}
            <section className="w-full h-[500px] relative my-6">
              <Image src={data.coverPhoto || "/images/themes/sunda-thumb.png"} alt="Separator" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end pb-12">
                <h3 className="text-white font-[family-name:var(--font-script)] text-4xl mb-6 drop-shadow-lg leading-tight text-center">Counting Days<br/>To Big Days</h3>
                
                {/* Countdown Timer */}
                <div className="flex gap-2 mb-8 px-4 w-full justify-center">
                  {['Hari', 'Jam', 'Menit', 'Detik'].map((unit, idx) => (
                    <div key={idx} className="bg-[#a58661] text-white flex-1 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg border border-white/20">
                      <span className="text-xl font-bold font-mono">0</span>
                      <span className="text-[10px] uppercase tracking-widest">{unit}</span>
                    </div>
                  ))}
                </div>

                <button className="px-6 py-2 border border-white text-white rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#54463a] transition-colors">
                  Save The Date
                </button>
              </div>
            </section>

            {/* ─── Events (Oval Cards) ─── */}
            <section className="w-full px-5 py-6 space-y-6">
              {data.events.map((event, idx) => (
                <div key={idx} className="bg-[#fcfaf7]/95 backdrop-blur-sm rounded-[100px] border-4 border-[#9c7b4a]/20 p-8 py-12 text-center shadow-md relative">
                  <h2 className="text-2xl font-[family-name:var(--font-script)] text-[#9c7b4a] mb-4">{event.name}</h2>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-bold text-[#54463a] uppercase tracking-widest">{event.date}</p>
                    <p className="text-[10px] bg-[#9c7b4a] text-white px-3 py-1 rounded-full inline-block font-medium tracking-widest">{event.time}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#54463a] uppercase">{event.venue}</p>
                    <p className="text-[10px] text-[#54463a]/80 leading-relaxed italic px-2">{event.address}</p>
                  </div>

                  {data.features?.maps && event.mapsUrl && (
                    <a 
                      href={event.mapsUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-6 inline-block px-6 py-2 border border-[#9c7b4a] text-[#9c7b4a] font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#9c7b4a] hover:text-white transition-colors"
                    >
                      Buka Peta
                    </a>
                  )}
                </div>
              ))}
            </section>

            {/* ─── Bottom Brown Background Section ─── */}
            <div className="w-full bg-[#9c7b4a] mt-10 rounded-t-[60px] pt-12 pb-16 px-5 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] text-white">
              
              {/* Photo inside brown section */}
              <div className="w-48 h-64 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white/20 shadow-xl relative mb-12">
                <Image src={data.coverPhoto || "/images/themes/sunda-thumb.png"} alt="Couple" fill className="object-cover" />
              </div>

              {/* RSVP Section Placeholder (Static for visual, logic usually handled by wrapper) */}
              <section className="text-center mb-16">
                <h2 className="text-3xl font-[family-name:var(--font-script)] mb-6">RSVP & Ucapan</h2>
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 text-left space-y-4">
                   <p className="text-xs text-center italic mb-4 opacity-80">Fitur Buku Tamu & RSVP</p>
                   {/* Form visual placeholder to match design */}
                   <input type="text" placeholder="Nama Anda" className="w-full px-4 py-3 bg-white text-[#54463a] rounded-lg text-xs" />
                   <textarea placeholder="Tulis ucapan..." className="w-full px-4 py-3 bg-white text-[#54463a] rounded-lg text-xs h-24" />
                   <button className="w-full py-3 bg-[#54463a] text-white rounded-lg text-xs font-bold uppercase tracking-widest">Kirim Ucapan</button>
                </div>
              </section>

              {/* Gallery */}
              {data.features?.gallery && data.gallery.length > 0 && (
                <section className="text-center mb-16">
                  <h2 className="text-3xl font-[family-name:var(--font-script)] mb-6">Galeri Kami</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {data.gallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border-2 border-white/20">
                        <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gift */}
              {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
                <section className="text-center mb-16">
                  <Gift className="w-8 h-8 text-white mx-auto mb-3 opacity-80" />
                  <h2 className="text-3xl font-[family-name:var(--font-script)] mb-4">Tanda Kasih</h2>
                  <p className="text-[11px] leading-relaxed mb-6 px-4 opacity-90">
                    Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi kami. 
                    Bagi yang ingin memberikan tanda kasih, dapat melalui:
                  </p>
                  <div className="space-y-4">
                    {data.giftInfo.bankAccounts.map((bank, idx) => (
                      <div key={idx} className="bg-white text-[#54463a] p-5 rounded-2xl shadow-lg">
                        <p className="text-base font-black text-[#9c7b4a] uppercase tracking-widest">{bank.bank}</p>
                        <p className="text-lg font-mono font-bold my-1">{bank.number}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-500">A.N. {bank.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Footer */}
              <footer className="text-center pt-8 border-t border-white/20">
                <p className="mb-3 italic text-[11px] opacity-80 px-4">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
                <p className="font-bold text-sm mb-6 uppercase tracking-widest">Wassalamu&apos;alaikum Wr. Wb.</p>
                <p className="text-[9px] opacity-50 uppercase tracking-[0.3em]">Momena Labs</p>
              </footer>

            </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
