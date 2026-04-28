'use client';

import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowLeft, Github, Chrome } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 relative overflow-hidden bg-grid">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F5A0]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7F5AF0]/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#E2E8F0] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <div className="glass-card p-8 md:p-10 border border-white/10">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F5A0] to-[#00C9FF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00F5A0]/20">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-black font-display text-white mb-2">Welcome Back</h1>
            <p className="text-[#64748B]">Sign in to your VolatilityAI account</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full glass-input pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-[#94A3B8]">Password</label>
                <button className="text-xs text-[#00F5A0] hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full glass-input pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black font-black text-lg shadow-lg shadow-[#00F5A0]/10 hover:shadow-[#00F5A0]/20 transition-all"
            >
              Sign In
            </motion.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#111827] px-2 text-[#475569]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors text-sm text-[#E2E8F0]">
                <Github className="w-4 h-4" />
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors text-sm text-[#E2E8F0]">
                <Chrome className="w-4 h-4" />
                Google
              </button>
            </div>
          </div>

          <p className="text-center mt-10 text-[#64748B] text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#00F5A0] font-bold hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
