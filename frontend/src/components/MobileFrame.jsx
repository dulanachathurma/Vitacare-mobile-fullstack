import { useEffect, useState } from 'react';

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Smartphone shell for desktop testing. On real phones (< 640px wide)
 * the frame disappears and the app fills the screen.
 */
export default function MobileFrame({ header, footer, children }) {
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 sm:flex sm:items-center sm:justify-center sm:p-6">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50 sm:h-[min(800px,92vh)] sm:w-[390px] sm:rounded-[3rem] sm:border-[10px] sm:border-slate-900 sm:shadow-2xl">
        {/* Notch */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900 sm:block" />

        {/* Status bar */}
        <div className="hidden h-9 shrink-0 items-end justify-between bg-white px-7 pb-1 text-[11px] font-semibold text-slate-700 sm:flex">
          <span>{time}</span>
          <span>5G ▮▮▮ 🔋</span>
        </div>

        {header}
        <main className="flex-1 overflow-y-auto">{children}</main>
        {footer}

        {/* Home indicator */}
        <div className="hidden h-5 shrink-0 items-center justify-center bg-white sm:flex">
          <div className="h-1 w-28 rounded-full bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
