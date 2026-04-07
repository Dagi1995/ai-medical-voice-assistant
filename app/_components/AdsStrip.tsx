import LogoLoop from "@/components/LogoLoop";

export function AdsStrip() {
  return (
    <div className="w-full py-10 border-y border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden relative z-10 shadow-sm">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 uppercase tracking-widest text-center font-bold">
        Trusted by Leading Healthcare Providers
      </p>
      <LogoLoop 
      //@ts-ignore
        speed={25} 
        direction="left"
        logos={[
          { node: <span className="text-2xl font-bold text-slate-400 dark:text-white/50 px-8 whitespace-nowrap">Mayo Clinic</span> },
          { node: <span className="text-2xl font-bold text-slate-400 dark:text-white/50 px-8 whitespace-nowrap">Johns Hopkins</span> },
          { node: <span className="text-2xl font-bold text-slate-400 dark:text-white/50 px-8 whitespace-nowrap">Cleveland Clinic</span> },
          { node: <span className="text-2xl font-bold text-slate-400 dark:text-white/50 px-8 whitespace-nowrap">Stanford Health</span> },
          { node: <span className="text-2xl font-bold text-slate-400 dark:text-white/50 px-8 whitespace-nowrap">Mount Sinai</span> },
          { node: <span className="text-2xl font-bold text-slate-400 dark:text-white/50 px-8 whitespace-nowrap">Kaiser Permanente</span> },
        ]}
      />
    </div>
  );
}
