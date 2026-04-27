import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export const HUD = () => {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const handleSpeed = (e: any) => setSpeed(e.detail);
    window.addEventListener('car-speed', handleSpeed);
    return () => window.removeEventListener('car-speed', handleSpeed);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-10 font-sans">
      {/* Top Row: Race Info */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/80 border-l-4 border-cyan-500 px-6 py-2 skew-x-[-15deg] backdrop-blur-md"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold skew-x-[15deg]">Position</p>
            <h2 className="text-4xl font-black italic skew-x-[15deg] neon-glow">01<span className="text-xl opacity-50">/12</span></h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/80 border-l-4 border-white px-6 py-2 skew-x-[-15deg] backdrop-blur-md"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold skew-x-[15deg]">Lap</p>
            <h2 className="text-2xl font-black italic skew-x-[15deg]">2<span className="text-sm opacity-50 uppercase"> of 3</span></h2>
          </motion.div>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <div className="bg-black/40 px-3 py-1 rounded border border-white/10 backdrop-blur-sm">
            <p className="text-[10px] font-mono text-white/60 uppercase">BRAKE: SPACE | RESET: R</p>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded border border-white/10 backdrop-blur-sm">
             <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none">Streets of Fortune</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Speedometer & Nitro */}
      <div className="flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-md p-5 rounded-sm border-t border-white/10 w-72"
        >
          <div className="flex justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-tighter text-white">Nitro Fuel</span>
            <span className="text-[10px] text-cyan-400 font-mono">100%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
          <div className="mt-3 text-[10px] italic font-medium text-neutral-500 tracking-wider">NIGHTFALL CIRCUIT - V1.0</div>
        </motion.div>

        {/* Speedometer Radial */}
        <div className="relative flex flex-col items-center mr-10 mb-5">
          <div 
            className="absolute bottom-[-30px] right-[-30px] w-80 h-80 bg-neutral-900/40 rounded-full border-[12px] border-neutral-800 border-t-cyan-500 transition-transform duration-100"
            style={{ transform: `rotate(${(speed / 250) * 250 + 45}deg)` }}
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex flex-col items-end"
          >
            <span className="text-9xl font-black italic leading-none tracking-tighter text-white tabular-nums neon-glow">{speed}</span>
            <div className="flex items-center gap-2 mt-[-10px]">
              <span className="text-2xl font-bold italic text-cyan-400 tracking-tighter">KM/H</span>
              <span className="bg-white text-black px-3 py-1 text-2xl font-black italic rounded-sm shadow-xl">4</span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
