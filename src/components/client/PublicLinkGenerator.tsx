"use client";

import { useState, useEffect } from "react";
import { Send, Copy } from "lucide-react";

const TEMPLATES = {
  formal: `Kepada Yth. Bapak/Ibu/Saudara/i\n*[nama]*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\n*Berikut link undangan kami:* \n[link-undangan]\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. \nTerima kasih.`,
  islami: `Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nKepada Yth.\n*[nama]*\n\nBismillah. Dengan memohon ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\n*Detail Acara & Undangan Digital:* \n[link-undangan]\n\nKehadiran dan doa restu Anda adalah anugerah terindah bagi kami.\nWassalamu'alaikum Warahmatullahi Wabarakatuh`,
};

export default function PublicLinkGenerator({ orderSlug }: { orderSlug: string }) {
  const [namesText, setNamesText] = useState("");
  const [template, setTemplate] = useState<keyof typeof TEMPLATES>("formal");
  const [hostName, setHostName] = useState("Kami yang berbahagia");
  const [generatedList, setGeneratedList] = useState<{name: string, url: string, message: string}[]>([]);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleGenerate = () => {
    if (!namesText.trim()) return;
    
    const names = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    const results = names.map(name => {
      const inviteUrl = `${baseUrl}/u/${orderSlug}`;
      const guestUrl = `${inviteUrl}?to=${encodeURIComponent(name)}`;
      
      let message = TEMPLATES[template]
        .replace("[nama]", name)
        .replace("[link-undangan]", guestUrl);
      
      message += `\n\nSalam hangat,\n*${hostName}*`;

      return {
        name,
        url: guestUrl,
        message,
      };
    });

    setGeneratedList(results);
  };

  const handleShare = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopy = (msg: string) => {
    navigator.clipboard.writeText(msg);
    alert("Pesan disalin!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-body)]">
            Yang Mengundang (Nama Keluarga/Panggilan)
          </label>
          <input 
            type="text" 
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-body)]">
            Daftar Nama Tamu (Satu nama per baris)
          </label>
          <textarea 
            rows={5}
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            placeholder="Contoh:&#10;Bpk. Budi Santoso&#10;Keluarga Haryanto"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-body)]">
            Pilihan Kata Pengantar
          </label>
          <div className="flex gap-2">
            <button 
              onClick={() => setTemplate("formal")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors border ${template === "formal" ? "bg-[#D4A843]/10 border-[#D4A843] text-[#D4A843] font-semibold" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}
            >
              Formal
            </button>
            <button 
              onClick={() => setTemplate("islami")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors border ${template === "islami" ? "bg-[#D4A843]/10 border-[#D4A843] text-[#D4A843] font-semibold" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}
            >
              Islami
            </button>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          className="w-full bg-[#D4A843] text-white font-semibold py-3 rounded-lg hover:bg-[#c29631] transition-colors"
        >
          Buat Link Undangan
        </button>
      </div>

      <div>
        {generatedList.length > 0 ? (
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-[family-name:var(--font-display)]">Hasil ({generatedList.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {generatedList.map((guest, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center gap-4">
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-900 truncate">{guest.name}</p>
                    <p className="text-xs text-blue-600 truncate">{guest.url}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleCopy(guest.message)}
                      className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      title="Copy Pesan"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleShare(guest.message)}
                      className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                      title="Kirim ke WhatsApp"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 text-center font-[family-name:var(--font-body)]">
            <Send className="w-12 h-12 mb-4 opacity-30" />
            <p>Masukkan daftar nama tamu lalu klik "Buat Link Undangan" untuk memunculkan daftar pengiriman.</p>
          </div>
        )}
      </div>
    </div>
  );
}
