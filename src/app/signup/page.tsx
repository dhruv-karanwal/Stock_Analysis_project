'use client';

import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 relative overflow-hidden bg-grid">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00F5A0]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00C9FF]/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
            <h1 className="text-3xl font-black font-display text-white mb-2">Create Account</h1>
            <p className="text-[#64748B]">Join the next generation of traders</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full glass-input pl-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
              <label className="text-sm font-medium text-[#94A3B8] ml-1">Password</label>
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

            <div className="flex items-start gap-3 py-2 ml-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 accent-[#00F5A0] w-4 h-4"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-[#64748B] leading-tight">
                I agree to the <Link href="#" className="text-[#00F5A0] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#00F5A0] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black font-black text-lg shadow-lg shadow-[#00F5A0]/10 hover:shadow-[#00F5A0]/20 transition-all mt-4"
            >
              Get Started
            </motion.button>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#00F5A0]/5 border border-[#00F5A0]/10 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00F5A0] shrink-0" />
            <p className="text-xs text-[#94A3B8]">
              Your data is encrypted. We use industry-standard security protocols to protect your information.
            </p>
          </div>

          <p className="text-center mt-10 text-[#64748B] text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-[#00F5A0] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
