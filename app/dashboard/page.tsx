import { prisma } from "../../lib/prisma"; 
import LogoutButton from "../components/LogoutButton";

// Import the security tools
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import TranscriptCard from "../components/TranscriptCard";

import TranscriptionManager from "../components/TranscriptionManager"; // 

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. THE GATEKEEPER: Check for the active session cookie
  const session = await auth.api.getSession({
    headers: await headers(), 
  });

  // 2. THE BOUNCER: If there is no session, instantly kick them to login
  if (!session) {
    redirect("/login");
  }

  // 3. THE REWARD: Only fetch the logs if they passed the security check
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
         <TranscriptionManager />
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
                <TranscriptCard key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}