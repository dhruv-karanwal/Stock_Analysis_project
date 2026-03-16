'use client';

import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Cpu, Moon } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [apiInterval, setApiInterval] = useState('30');
  const [confThreshold, setConfThreshold] = useState('70');
  const [selectedModel, setSelectedModel] = useState('xgboost-lstm');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${value ? 'bg-[#00F5A0]' : 'bg-[#1a2235]'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="p-5 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold font-display text-[#E2E8F0] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#94A3B8]" />
          Settings
        </h1>
        <p className="text-[#64748B] text-sm mt-1">Configure your dashboard preferences</p>
      </div>

      {[
        {
          section: 'Notifications',
          icon: Bell,
          color: '#F59E0B',
          items: [
            { label: 'Price Alerts', desc: 'Get notified on significant price movements', value: notifications, onChange: setNotifications, type: 'toggle' },
            { label: 'High Risk Alerts', desc: 'Notify when volatility score exceeds 0.7', value: true, type: 'toggle' },
          ],
        },
        {
          section: 'Data & Refresh',
          icon: Database,
          color: '#00C9FF',
          items: [
            { label: 'Auto Refresh', desc: 'Auto-update stock data at the set interval', value: autoRefresh, onChange: setAutoRefresh, type: 'toggle' },
            { label: 'Refresh Interval', desc: 'Data polling interval (seconds)', value: apiInterval, onChange: setApiInterval, type: 'input', placeholder: '30' },
          ],
        },
        {
          section: 'ML Model',
          icon: Cpu,
          color: '#7F5AF0',
          items: [
            { label: 'Confidence Threshold', desc: 'Minimum confidence % to show predictions', value: confThreshold, onChange: setConfThreshold, type: 'input', suffix: '%' },
            { label: 'Model Type', desc: 'Select the active prediction model', value: selectedModel, type: 'select', options: [
              { v: 'xgboost-lstm', l: 'XGBoost + LSTM Ensemble' },
              { v: 'rf', l: 'Random Forest' },
              { v: 'gru', l: 'GRU Neural Network' },
            ], onChange: setSelectedModel },
          ],
        },
        {
          section: 'Appearance',
          icon: Moon,
          color: '#00F5A0',
          items: [
            { label: 'Dark Mode', desc: 'Use dark fintech theme (recommended)', value: darkMode, onChange: setDarkMode, type: 'toggle' },
          ],
        },
      ].map((group, gi) => (
        <motion.div
          key={group.section}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="p-2 rounded-xl" style={{ backgroundColor: group.color + '15' }}>
              <group.icon className="w-4 h-4" style={{ color: group.color }} />
            </div>
            <h2 className="text-[#E2E8F0] font-semibold text-sm">{group.section}</h2>
          </div>
          {group.items.map((item: any) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[#E2E8F0] text-sm font-medium">{item.label}</div>
                <div className="text-[#64748B] text-xs mt-0.5">{item.desc}</div>
              </div>
              {item.type === 'toggle' && <Toggle value={item.value} onChange={item.onChange ?? (() => {})} />}
              {item.type === 'input' && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => item.onChange(e.target.value)}
                    className="w-16 bg-[#0B0F19] text-[#E2E8F0] text-sm text-center rounded-lg px-2 py-1.5 border border-white/10 outline-none focus:border-[#00F5A0]/40 font-mono"
                  />
                  {item.suffix && <span className="text-[#64748B] text-xs">{item.suffix}</span>}
                </div>
              )}
              {item.type === 'select' && (
                <select
                  value={item.value}
                  onChange={(e) => item.onChange(e.target.value)}
                  className="bg-[#0B0F19] text-[#E2E8F0] text-xs rounded-lg px-3 py-1.5 border border-white/10 outline-none focus:border-[#7F5AF0]/40 cursor-pointer"
                >
                  {item.options.map((opt: any) => (
                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </motion.div>
      ))}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black font-bold text-sm shadow-lg"
      >
        Save Settings
      </motion.button>
    </div>
  );
}
