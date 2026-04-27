/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene } from './components/Game/Scene';
import { HUD } from './components/UI/HUD';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <Scene />
      <HUD />
      
      {/* Loading Script / SplashScreen can be added here if needed */}
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center bg-black animate-fade-out" style={{ animationDelay: '3s', animationFillMode: 'forwards' }}>
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="px-12 py-6 border-2 border-white/50 bg-black/40 backdrop-blur-2xl text-center"
         >
           <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-2 neon-glow">NEED FOR SPEED</h1>
           <p className="text-sm tracking-[0.5em] font-bold text-cyan-400 animate-pulse">PRESS [W] OR [↑] TO START RACE</p>
         </motion.div>
      </div>

      <style>{`
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
        .animate-fade-out {
          animation: fade-out 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
