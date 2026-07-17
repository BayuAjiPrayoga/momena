export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Halaman undangan tidak memakai Navbar atau Footer utama
    // Memenuhi 100% viewport agar tema bisa merender full-screen
    <div className="w-full min-h-screen bg-black">
      {children}
    </div>
  );
}
