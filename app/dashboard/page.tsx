import { prisma } from "../../lib/prisma"; 
import AudioRecorder from "../components/AudioRecorder"; 
import LogoutButton from "../components/LogoutButton";

export default async function DashboardPage() {
  // Fetch newest logs at the top
  const logs = await prisma.transcript.findMany({
    orderBy: { createdAt: "desc" }, 
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex overflow-hidden selection:bg-[#D4AF37]/30">
      
      {/* LEFT SIDE: FIXED COMMAND CENTER */}
      {/* Added 'relative' to the container so we can anchor the logout button to the bottom */}
      <div className="w-[35%] max-w-[450px] min-w-[320px] h-screen sticky top-0 flex flex-col justify-center px-12 border-r border-white/5 bg-[#0A0A0A] z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)] relative">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white/90">VocaLog AI</h1>
          <p className="text-[#D4AF37]/60 mt-2 text-xs tracking-[0.2em] uppercase font-semibold">Admin Command Center</p>
          <div className="h-px w-12 bg-[#D4AF37]/30 mt-6"></div>
        </header>

        <section className="w-full">
          <AudioRecorder />
        </section>

        {/* LOGOUT ANCHOR */}
        <div className="absolute bottom-10 left-12">
          <LogoutButton />
        </div>
      </div>

      {/* RIGHT SIDE: SCROLLABLE LUXURY LOGS */}
      {/* The bracketed classes hide the scrollbar across Chrome, Safari, and Firefox while keeping it scrollable */}
      <div className="flex-1 h-screen overflow-y-auto p-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] bg-[#0f0f0f]">
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold border-b border-white/5 pb-4 mb-8 text-white/80 tracking-wide">
            Recent Logs
          </h2>
          
          {logs.length === 0 ? (
            <p className="text-gray-600 italic font-light">No voice logs recorded yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-7 bg-[#141414] border border-white/5 rounded-2xl shadow-xl hover:bg-[#181818] hover:border-white/10 transition-all duration-500 group"
                >
                  <p className="text-[#E0E0E0] leading-relaxed text-[17px] font-light tracking-wide">
                    {log.content}
                  </p>
                  
                  {/* Elegant timestamp footer */}
                  <div className="flex items-center gap-3 mt-5 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="h-1 w-1 rounded-full bg-[#D4AF37]"></div>
                    <p className="text-[11px] text-gray-400 font-mono tracking-widest uppercase">
                      Logged: {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}