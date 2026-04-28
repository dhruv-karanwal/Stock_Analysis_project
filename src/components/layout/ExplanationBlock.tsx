'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Info } from 'lucide-react';

interface ExplanationBlockProps {
  title: string;
  description: string;
  whyItMatters: string;
  icon?: 'info' | 'help';
  className?: string;
}

export function ExplanationBlock({ 
  title, 
  description, 
  whyItMatters, 
  icon = 'info',
  className = ''
}: ExplanationBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 border border-white/5 rounded-2xl p-5 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-white/5 flex-shrink-0">
          {icon === 'info' ? <Info className="w-4 h-4 text-[#00C9FF]" /> : <HelpCircle className="w-4 h-4 text-[#7F5AF0]" />}
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="text-[#E2E8F0] text-sm font-bold">{title}</h4>
            <p className="text-[#94A3B8] text-xs mt-1 leading-relaxed">{description}</p>
          </div>
          <div className="pt-3 border-t border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00F5A0] block mb-1">
              Why this matters:
            </span>
            <p className="text-[#64748B] text-xs italic leading-relaxed">
              "{whyItMatters}"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
