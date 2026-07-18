"use client";

import { useEffect, useState, useRef } from "react";
import type { ThemeProps } from "@/lib/types";
import Image from "next/image";
import { Play, Pause, MapPin, Calendar, Gift, Heart, ArrowDown, Check, Send } from "lucide-react";

export default function SundaTheme({ data, guestName }: ThemeProps & { guestName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // RSVP State
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [rsvpGuestCount, setRsvpGuestCount] = useState(1);
  const [isRsvpSubmitting, setIsRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Guestbook State
  const [gbName, setGbName] = useState(data.guest.name || "");
  const [gbMessage, setGbMessage] = useState("");
  const [isGbSubmitting, setIsGbSubmitting] = useState(false);
  const [gbMessages, setGbMessages] = useState(data.guestbookMessages || []);

  const handleRsvpSubmit = async () => {
    if (!rsvpStatus) return;
    setIsRsvpSubmitting(true);
    try {
      if (data.rsvpEndpoint) {
        await fetch(data.rsvpEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.guest.name,
            status: rsvpStatus,
            guestCount: rsvpGuestCount
          })
        });
      }
      setRsvpSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRsvpSubmitting(false);
    }
  };

  const handleGuestbookSubmit = async () => {
    if (!gbName || !gbMessage) return;
    setIsGbSubmitting(true);
    try {
      const newMsg = {
        id: Date.now().toString(),
        name: gbName,
        message: gbMessage,
        createdAt: new Date().toISOString()
      };
      
      if (data.guestbookEndpoint) {
        await fetch(data.guestbookEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: gbName,
            message: gbMessage
          })
        });
      }

      setGbMessages([newMsg, ...gbMessages]);
      setGbMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsGbSubmitting(false);
    }
  };

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
        <div className="fixed inset-y-0 left-0 right-0 mx-auto lg:left-auto lg:right-0 lg:mx-0 w-full lg:w-[430px] md:max-w-[430px] z-0 pointer-events-none opacity-50">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "top center"
            }}
          />
        </div>

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
                    <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Bride" fill className="object-cover object-top" />
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
                    <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Groom" fill className="object-cover object-top" />
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

            {/* ─── Events & Love Story Section (Brown Background) ─── */}
            <div className="w-full bg-[#ae8d5e] mt-6 pt-16 pb-16 px-5 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
              
              {/* Events */}
              <section className="space-y-8 mb-16">
                {data.events.map((event, idx) => (
                  <div key={idx} className="relative bg-[#fcfaf7] w-full max-w-[300px] mx-auto rounded-[150px] aspect-[1/1.6] flex flex-col items-center justify-center p-8 overflow-hidden shadow-xl border-4 border-[#fcfaf7]">
                    {/* The floral background clipped inside the oval */}
                    <div className="absolute inset-0 opacity-40 bg-[url('/images/themes/sunda-floral-bg.png')] bg-cover bg-bottom mix-blend-multiply pointer-events-none" />
                    
                    <div className="relative z-10 text-center flex flex-col items-center justify-center h-full pt-10 pb-6 w-full">
                      <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#9c7b4a] mb-6 drop-shadow-sm">{event.name}</h3>
                      
                      <div className="space-y-1 mb-6">
                         <p className="text-sm font-bold text-[#1a1a1a]">{event.date}</p>
                         <p className="text-xs text-[#333]">{event.time}</p>
                      </div>
                      
                      <MapPin className="w-7 h-7 text-[#ae8d5e] mb-3 mx-auto" fill="currentColor" />
                      <p className="text-sm font-bold text-[#1a1a1a] mb-1 leading-snug">{event.venue}</p>
                      <p className="text-xs text-[#333] leading-relaxed mb-6">{event.address}</p>
                      
                      {data.features?.maps && event.mapsUrl && (
                        <a 
                          href={event.mapsUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-[#ae8d5e] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#836338] transition shadow-md mt-auto inline-flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4" fill="currentColor" /> Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {/* Love Story */}
              {data.features?.loveStory && data.loveStory && data.loveStory.length > 0 && (
                <section className="text-white mt-16 mb-8">
                  <h2 className="text-5xl font-[family-name:var(--font-script)] text-center mb-12">Love Story</h2>
                  <div className="max-w-xs mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-2 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-white/30">
                    {data.loveStory.map((story, idx) => (
                      <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                        {/* Timeline Dot */}
                        <div className="flex items-center justify-center w-4 h-4 mt-1 rounded-full border border-[#ae8d5e] bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative" />
                        {/* Content */}
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] text-left">
                          <p className="font-bold text-sm mb-1">{new Date(story.date).getFullYear()}</p>
                          <p className="text-[10px] leading-relaxed opacity-90">{story.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Live Streaming (Transparent Background) */}
            {data.features?.streaming && data.streamingUrl && (
              <section className="w-full px-5 py-16 relative z-10">
                <div className="bg-[#fcfaf7] rounded-3xl p-8 text-center shadow-xl border-4 border-[#ae8d5e]/20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30 bg-[url('/images/themes/sunda-floral-bg.png')] bg-cover bg-bottom mix-blend-multiply pointer-events-none" />
                  
                  <div className="relative z-10">
                    <h2 className="text-4xl font-[family-name:var(--font-script)] text-[#9c7b4a] mb-4">Live Streaming</h2>
                    <p className="text-[10px] text-[#54463a] leading-relaxed mb-6 px-2 font-medium">
                      Temui kami secara virtual, untuk menyaksikan acara pernikahan kami melalui tautan di bawah ini:
                    </p>
                    <a href={data.streamingUrl} target="_blank" rel="noreferrer" className="bg-[#ae8d5e] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#836338] transition inline-block shadow-md">
                      @username
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* ─── Bottom Brown Background Section ─── */}
            <div className="w-full bg-[#ae8d5e] rounded-t-[60px] pt-16 pb-16 px-5 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] text-white">
              
              {/* Photo inside brown section */}
              <div className="w-48 h-64 mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white/20 shadow-xl relative mb-16">
                <Image src={data.coverPhoto || "/images/themes/sunda-thumb.png"} alt="Couple" fill className="object-cover object-top" />
              </div>

              {/* Wedding Gift */}
              {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
                <section className="text-center mb-16">
                  <Gift className="w-10 h-10 mx-auto mb-3 opacity-90" />
                  <h2 className="text-5xl font-[family-name:var(--font-script)] mb-4">Wedding Gift</h2>
                  <p className="text-[10px] leading-relaxed mb-8 px-2 opacity-90 font-medium">
                    Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
                  </p>
                  <div className="space-y-4 max-w-sm mx-auto">
                    {data.giftInfo.bankAccounts.map((bank, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] text-[#54463a] p-6 rounded-xl shadow-xl relative overflow-hidden border border-white/50 text-center">
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#ae8d5e]/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#ae8d5e]/5 rounded-full blur-xl pointer-events-none" />
                        
                        <h3 className="text-xl font-black text-[#00529b] italic uppercase tracking-wider mb-1">{bank.bank}</h3>
                        <p className="text-[10px] font-bold uppercase mb-1">{bank.name}</p>
                        <p className="text-lg font-mono font-bold mb-4 tracking-widest text-[#333]">{bank.number}</p>
                        <button 
                           onClick={() => navigator.clipboard.writeText(bank.number)}
                           className="bg-[#ae8d5e] text-white px-5 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#836338] transition inline-flex items-center gap-2 shadow"
                        >
                           Salin Nomor
                        </button>
                      </div>
                    ))}
                    
                    {/* Alamat Kirim Kado */}
                    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] text-[#54463a] p-6 rounded-xl shadow-xl relative overflow-hidden border border-white/50 text-center mt-6">
                      <p className="text-[10px] font-bold uppercase mb-2">Alamat Kirim Kado</p>
                      <p className="text-xs font-bold leading-relaxed mb-4">{data.giftInfo?.shippingAddress || "Jalan Kembangan No 4 Jakarta"}</p>
                      <button 
                         onClick={() => navigator.clipboard.writeText(data.giftInfo?.shippingAddress || "Jalan Kembangan No 4 Jakarta")}
                         className="bg-[#ae8d5e] text-white px-5 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#836338] transition inline-flex items-center gap-2 shadow"
                      >
                         Salin Alamat
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* RSVP Section */}
              {data.features?.rsvp && (
                <section className="text-center mb-16">
                  <h2 className="text-4xl font-[family-name:var(--font-script)] mb-6">RSVP</h2>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 text-left space-y-5">
                    {rsvpSubmitted ? (
                      <div className="text-center py-4">
                        <Check className="w-12 h-12 text-white/80 mx-auto mb-3" />
                        <p className="text-sm font-bold tracking-widest uppercase">Terima Kasih</p>
                        <p className="text-xs mt-2 opacity-80">Konfirmasi kehadiran Anda telah kami terima.</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-center italic opacity-80 mb-2">Konfirmasi kehadiran Anda</p>
                        <div className="grid grid-cols-1 gap-3">
                          {["Hadir", "Tidak Hadir", "Mungkin"].map((opt) => (
                            <button 
                              key={opt} 
                              onClick={() => setRsvpStatus(opt)} 
                              className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${rsvpStatus === opt ? "bg-white text-[#ae8d5e] border-white shadow-lg" : "bg-transparent text-white border-white/30 hover:bg-white/10"}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {rsvpStatus === "Hadir" && (
                          <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl">
                            <span className="text-xs font-bold uppercase tracking-widest">Jumlah Tamu</span>
                            <div className="flex items-center gap-4">
                              <button onClick={() => setRsvpGuestCount(Math.max(1, rsvpGuestCount - 1))} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold">-</button>
                              <span className="text-sm font-bold w-4 text-center">{rsvpGuestCount}</span>
                              <button onClick={() => setRsvpGuestCount(Math.min(5, rsvpGuestCount + 1))} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold">+</button>
                            </div>
                          </div>
                        )}
                        <button 
                          onClick={handleRsvpSubmit} 
                          disabled={!rsvpStatus || isRsvpSubmitting} 
                          className="w-full py-4 mt-2 bg-[#54463a] text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-[#3d332a] transition-colors"
                        >
                          {isRsvpSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                        </button>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Guestbook Section */}
              {data.features?.guestbook && (
                <section className="text-center mb-16">
                  <h2 className="text-4xl font-[family-name:var(--font-script)] mb-6">Buku Tamu</h2>
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 text-left space-y-4">
                     <p className="text-xs text-center italic mb-4 opacity-80">Tinggalkan pesan & doa restu</p>
                     <input 
                        type="text" 
                        value={gbName}
                        onChange={(e) => setGbName(e.target.value)}
                        placeholder="Nama Anda" 
                        className="w-full px-4 py-3 bg-white/90 text-[#54463a] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#54463a]" 
                     />
                     <textarea 
                        value={gbMessage}
                        onChange={(e) => setGbMessage(e.target.value)}
                        placeholder="Tulis ucapan..." 
                        className="w-full px-4 py-3 bg-white/90 text-[#54463a] rounded-lg text-xs h-24 resize-none outline-none focus:ring-2 focus:ring-[#54463a]" 
                     />
                     <button 
                        onClick={handleGuestbookSubmit}
                        disabled={!gbName || !gbMessage || isGbSubmitting}
                        className="w-full py-3 bg-[#54463a] text-white rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-[#3d332a] transition-colors flex items-center justify-center gap-2"
                     >
                        <Send className="w-4 h-4" />
                        {isGbSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                     </button>
                  </div>
                  
                  {gbMessages.length > 0 && (
                    <div className="mt-8 space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-left">
                      {gbMessages.map((msg) => (
                        <div key={msg.id} className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                          <p className="text-sm font-bold text-white mb-1">{msg.name}</p>
                          <p className="text-xs text-white/90 leading-relaxed italic">"{msg.message}"</p>
                          <p className="text-[10px] text-white/50 mt-3">{new Date(msg.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

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
