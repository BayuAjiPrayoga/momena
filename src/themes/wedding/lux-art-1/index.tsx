"use client";

import type { ThemeProps } from "@/lib/types";
import { useInView, useCountdown, useAudioPlayer } from "@/lib/hooks";
import { useState } from "react";
import { Music, Music2, MapPin, Calendar, Copy, Check, Send, ChevronDown, Heart, Gift, MessageCircle, Users, Clock, Image as ImageIcon } from "lucide-react";

/* ─── Helper: Section wrapper with scroll animation ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`py-16 md:py-24 px-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </section>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4A843]/60" />
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#D4A843]"><path d="M10 2l2.5 5.5L18 9l-4 4 1 5.5L10 16l-5 2.5L6 13 2 9l5.5-1.5z" fill="currentColor" opacity="0.7"/></svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4A843]/60" />
    </div>
  );
}

/* ─── Cover Section ─── */
function CoverSection({ data, onOpen }: ThemeProps & { onOpen: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#1a1510] via-[#2a2018] to-[#1a1510] text-white text-center px-6">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='%23D4A843' fill-opacity='0.15'/%3E%3C/svg%3E\")", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 space-y-6 animate-[fade-in_1s_ease-out]">
        <p className="text-sm tracking-[0.3em] uppercase text-[#D4A843]/80 font-[family-name:var(--font-body)]">The Wedding of</p>
        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-script)] text-[#D4A843]">
          {data.couple.person1.name} <span className="text-3xl md:text-5xl">&</span> {data.couple.person2.name}
        </h1>
        <Ornament />
        <p className="text-[#D4A843]/70 text-sm font-[family-name:var(--font-body)]">{new Date(data.events[0]?.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="pt-4">
          <p className="text-xs text-white/50 mb-2 font-[family-name:var(--font-body)]">Kepada Yth.</p>
          <p className="text-xl md:text-2xl font-[family-name:var(--font-display)] text-white">{data.guest.name}</p>
        </div>
        <button onClick={onOpen} className="mt-8 px-8 py-3 bg-[#D4A843] text-[#1a1510] font-semibold rounded-full hover:bg-[#FFD966] transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto font-[family-name:var(--font-body)]">
          <Heart className="w-4 h-4" /> Buka Undangan
        </button>
      </div>
      <ChevronDown className="absolute bottom-8 w-6 h-6 text-[#D4A843]/50 animate-bounce" />
    </div>
  );
}

/* ─── Couple Section ─── */
function CoupleSection({ data }: ThemeProps) {
  return (
    <Section className="bg-[#FFFDF7] text-center" id="couple">
      <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843] font-[family-name:var(--font-body)]">Bismillahirrahmanirrahim</p>
      <p className="mt-4 text-sm text-neutral-600 max-w-lg mx-auto italic font-[family-name:var(--font-arabic)] leading-relaxed">
        &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.&rdquo;
        <br /><span className="text-xs not-italic text-neutral-400">(QS. Ar-Rum: 21)</span>
      </p>
      <Ornament />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
        {[data.couple.person1, data.couple.person2].map((person, i) => (
          <div key={i} className="space-y-3">
            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#D4A843]/20 to-[#FFD966]/10 border-2 border-[#D4A843]/30 flex items-center justify-center">
              {person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full rounded-full object-cover" /> : <Heart className="w-12 h-12 text-[#D4A843]/40" />}
            </div>
            <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#8C6D1F]">{person.name}</h2>
            <p className="text-sm text-neutral-700 font-[family-name:var(--font-body)]">{person.fullName}</p>
            <p className="text-xs text-neutral-500 font-[family-name:var(--font-body)]">{person.parents}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Countdown Section ─── */
function CountdownSection({ data }: ThemeProps) {
  const timeLeft = useCountdown(data.events[0]?.date || "");
  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];
  return (
    <Section className="bg-gradient-to-b from-[#2a2018] to-[#1a1510] text-center text-white" id="countdown">
      <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/80 font-[family-name:var(--font-body)]">Menghitung Hari</p>
      <h2 className="text-3xl mt-2 font-[family-name:var(--font-display)] text-[#D4A843]">Save The Date</h2>
      <div className="flex justify-center gap-4 md:gap-8 mt-10">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-[#FFD966] font-[family-name:var(--font-display)] tabular-nums">{String(u.value).padStart(2, "0")}</span>
            <span className="text-xs mt-2 text-[#D4A843]/60 uppercase tracking-wider font-[family-name:var(--font-body)]">{u.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Event Section ─── */
function EventSection({ data }: ThemeProps) {
  return (
    <Section className="bg-[#FFFDF7] text-center" id="event">
      <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843] font-[family-name:var(--font-body)]">Waktu & Tempat</p>
      <h2 className="text-3xl mt-2 font-[family-name:var(--font-display)] text-[#3D2F0D]">Acara Pernikahan</h2>
      <Ornament />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {data.events.map((evt, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-[#D4A843]/10 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-[family-name:var(--font-display)] text-[#8C6D1F]">{evt.name}</h3>
            <div className="mt-4 space-y-3 text-sm text-neutral-600 font-[family-name:var(--font-body)]">
              <p className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-[#D4A843]" />{new Date(evt.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <p className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-[#D4A843]" />{evt.time}</p>
              <p className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4 text-[#D4A843]" />{evt.venue}</p>
              <p className="text-xs text-neutral-400">{evt.address}</p>
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <a href={evt.mapsUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs bg-[#D4A843] text-white rounded-full hover:bg-[#B8922E] transition font-[family-name:var(--font-body)]">
                <MapPin className="w-3 h-3 inline mr-1" />Buka Maps
              </a>
              <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.name)}&dates=${new Date(evt.date).toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(evt.date).toISOString().replace(/[-:]/g, "").split(".")[0]}Z&location=${encodeURIComponent(evt.venue)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs border border-[#D4A843] text-[#D4A843] rounded-full hover:bg-[#D4A843]/10 transition font-[family-name:var(--font-body)]">
                <Calendar className="w-3 h-3 inline mr-1" />Kalender
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Gallery Section ─── */
function GallerySection({ data }: ThemeProps) {
  if (!data.features.gallery || data.gallery.length === 0) return null;
  return (
    <Section className="bg-gradient-to-b from-[#2a2018] to-[#1a1510] text-center text-white" id="gallery">
      <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/80 font-[family-name:var(--font-body)]">Galeri Foto</p>
      <h2 className="text-3xl mt-2 font-[family-name:var(--font-display)] text-[#D4A843]">Our Moments</h2>
      <Ornament />
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {data.gallery.map((img, i) => (
          <div key={i} className={`relative overflow-hidden rounded-xl group ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
            <div className="aspect-square bg-gradient-to-br from-[#D4A843]/20 to-[#8C6D1F]/10 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-[#D4A843]/30" />
            </div>
            {img.caption && <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"><p className="text-xs text-white">{img.caption}</p></div>}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Love Story Section ─── */
function LoveStorySection({ data }: ThemeProps) {
  if (!data.features.loveStory || !data.loveStory?.length) return null;
  return (
    <Section className="bg-[#FFFDF7] text-center" id="love-story">
      <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843] font-[family-name:var(--font-body)]">Cerita Kami</p>
      <h2 className="text-3xl mt-2 font-[family-name:var(--font-display)] text-[#3D2F0D]">Love Story</h2>
      <Ornament />
      <div className="mt-10 max-w-xl mx-auto space-y-0">
        {data.loveStory.map((item, i) => (
          <div key={i} className="relative pl-8 pb-10 border-l-2 border-[#D4A843]/30 text-left last:pb-0">
            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#D4A843] rounded-full border-4 border-[#FFFDF7]" />
            <p className="text-xs text-[#D4A843] font-semibold font-[family-name:var(--font-body)]">{new Date(item.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
            <h3 className="text-lg font-[family-name:var(--font-display)] text-[#3D2F0D] mt-1">{item.title}</h3>
            <p className="text-sm text-neutral-600 mt-2 font-[family-name:var(--font-body)] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── RSVP Section ─── */
function RsvpSection({ data }: ThemeProps) {
  const [status, setStatus] = useState<string>("");
  const [guestCount, setGuestCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  if (!data.features.rsvp) return null;
  return (
    <Section className="bg-gradient-to-b from-[#2a2018] to-[#1a1510] text-center text-white" id="rsvp">
      <Users className="w-8 h-8 text-[#D4A843] mx-auto" />
      <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#D4A843]">Konfirmasi Kehadiran</h2>
      <Ornament />
      {submitted ? (
        <div className="mt-8 p-6 bg-[#D4A843]/10 rounded-2xl max-w-md mx-auto"><Check className="w-10 h-10 text-[#D4A843] mx-auto mb-3" /><p className="text-[#D4A843] font-[family-name:var(--font-body)]">Terima kasih telah mengkonfirmasi!</p></div>
      ) : (
        <div className="mt-8 max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {["Hadir", "Tidak Hadir", "Masih Ragu"].map((opt) => (
              <button key={opt} onClick={() => setStatus(opt)} className={`py-3 px-2 rounded-xl text-sm font-[family-name:var(--font-body)] transition-all ${status === opt ? "bg-[#D4A843] text-[#1a1510] scale-105" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>{opt}</button>
            ))}
          </div>
          {status === "Hadir" && (
            <div className="flex items-center justify-center gap-4 text-white/70 font-[family-name:var(--font-body)]">
              <span className="text-sm">Jumlah tamu:</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition">-</button>
                <span className="w-8 text-center text-[#D4A843] font-bold">{guestCount}</span>
                <button onClick={() => setGuestCount(Math.min(5, guestCount + 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition">+</button>
              </div>
            </div>
          )}
          <button onClick={() => setSubmitted(true)} disabled={!status} className="w-full py-3 bg-[#D4A843] text-[#1a1510] rounded-full font-semibold hover:bg-[#FFD966] transition disabled:opacity-40 disabled:cursor-not-allowed font-[family-name:var(--font-body)]">Kirim RSVP</button>
        </div>
      )}
    </Section>
  );
}

/* ─── Guestbook Section ─── */
function GuestbookSection({ data }: ThemeProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [msgs, setMsgs] = useState(data.guestbookMessages);
  if (!data.features.guestbook) return null;
  return (
    <Section className="bg-[#FFFDF7] text-center" id="guestbook">
      <MessageCircle className="w-8 h-8 text-[#D4A843] mx-auto" />
      <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#3D2F0D]">Ucapan & Doa</h2>
      <Ornament />
      <div className="mt-8 max-w-lg mx-auto space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 rounded-xl border border-[#D4A843]/20 bg-white text-sm focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] outline-none transition font-[family-name:var(--font-body)]" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis ucapan & doa..." rows={3} className="w-full px-4 py-3 rounded-xl border border-[#D4A843]/20 bg-white text-sm focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] outline-none transition resize-none font-[family-name:var(--font-body)]" />
        <button onClick={() => { if (name && message) { setMsgs([{ id: String(Date.now()), name, message, createdAt: new Date().toISOString() }, ...msgs]); setName(""); setMessage(""); } }} className="w-full py-3 bg-[#D4A843] text-[#1a1510] rounded-full font-semibold hover:bg-[#FFD966] transition font-[family-name:var(--font-body)] flex items-center justify-center gap-2"><Send className="w-4 h-4" />Kirim Ucapan</button>
      </div>
      <div className="mt-8 max-w-lg mx-auto space-y-3 max-h-80 overflow-y-auto">
        {msgs.map((m) => (
          <div key={m.id} className="text-left p-4 bg-white rounded-xl border border-[#D4A843]/10 shadow-sm">
            <p className="text-sm font-semibold text-[#8C6D1F] font-[family-name:var(--font-body)]">{m.name}</p>
            <p className="text-sm text-neutral-600 mt-1 font-[family-name:var(--font-body)]">{m.message}</p>
            <p className="text-xs text-neutral-400 mt-2 font-[family-name:var(--font-body)]">{new Date(m.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Gift Section ─── */
function GiftSection({ data }: ThemeProps) {
  const [copied, setCopied] = useState<number | null>(null);
  if (!data.features.gift || !data.giftInfo) return null;
  const copyToClipboard = (text: string, i: number) => { navigator.clipboard.writeText(text); setCopied(i); setTimeout(() => setCopied(null), 2000); };
  return (
    <Section className="bg-gradient-to-b from-[#2a2018] to-[#1a1510] text-center text-white" id="gift">
      <Gift className="w-8 h-8 text-[#D4A843] mx-auto" />
      <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#D4A843]">Amplop Digital</h2>
      <p className="mt-2 text-sm text-white/60 max-w-md mx-auto font-[family-name:var(--font-body)]">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan amplop digital.</p>
      <Ornament />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        {data.giftInfo.bankAccounts.map((acc, i) => (
          <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-[#D4A843]/20">
            <p className="text-xs text-[#D4A843]/60 uppercase tracking-wider font-[family-name:var(--font-body)]">{acc.bank}</p>
            <p className="text-lg font-[family-name:var(--font-mono-clean)] text-[#FFD966] mt-2 tracking-wider">{acc.number}</p>
            <p className="text-sm text-white/50 mt-1 font-[family-name:var(--font-body)]">a.n. {acc.name}</p>
            <button onClick={() => copyToClipboard(acc.number, i)} className="mt-4 px-4 py-2 text-xs bg-[#D4A843]/20 text-[#D4A843] rounded-full hover:bg-[#D4A843]/30 transition font-[family-name:var(--font-body)] flex items-center justify-center gap-1 mx-auto">
              {copied === i ? <><Check className="w-3 h-3" />Tersalin!</> : <><Copy className="w-3 h-3" />Salin Nomor</>}
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Footer ─── */
function FooterSection({ data }: ThemeProps) {
  return (
    <div className="py-12 bg-[#1a1510] text-center text-white/40">
      <p className="text-2xl font-[family-name:var(--font-script)] text-[#D4A843]/60">{data.couple.person1.name} & {data.couple.person2.name}</p>
      <p className="text-xs mt-4 font-[family-name:var(--font-body)]">Powered by <span className="text-[#D4A843]/80">Momena Labs</span></p>
    </div>
  );
}

/* ─── Audio Player (floating) ─── */
function AudioPlayerButton({ musicUrl }: { musicUrl?: string }) {
  const { isPlaying, toggle } = useAudioPlayer(musicUrl);
  if (!musicUrl) return null;
  return (
    <button onClick={toggle} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#D4A843] text-[#1a1510] rounded-full shadow-lg flex items-center justify-center hover:bg-[#FFD966] transition-all hover:scale-110" aria-label={isPlaying ? "Pause musik" : "Play musik"}>
      {isPlaying ? <Music className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
    </button>
  );
}

/* ─── Main Theme Component ─── */
export default function LuxArt1Theme({ data }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);

  if (!isOpened) {
    return <CoverSection data={data} onOpen={() => setIsOpened(true)} />;
  }

  return (
    <div className="min-h-screen">
      <AudioPlayerButton musicUrl={data.musicUrl} />
      <CoupleSection data={data} />
      {data.features.countdown && <CountdownSection data={data} />}
      <EventSection data={data} />
      {data.features.loveStory && <LoveStorySection data={data} />}
      {data.features.gallery && <GallerySection data={data} />}
      <RsvpSection data={data} />
      <GuestbookSection data={data} />
      <GiftSection data={data} />
      <FooterSection data={data} />
    </div>
  );
}
