/**
 * Top header bar with search, notifications, and user menu
 */

'use client';

import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { setSearchQuery, wsConnected } = useDashboardStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-gradient-to-r from-slate-800 to-slate-800 border-b border-slate-700 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search metrics..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              wsConnected ? 'bg-green-500' : 'bg-red-500'
            } animate-pulse`}
          />
          <span className="hidden sm:inline text-xs text-slate-400">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        {/* Settings Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AW
            </div>
            <span className="hidden sm:inline text-sm">Alfredo</span>
          </motion.button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-slate-200">Alfredo Wiesner</p>
                  <p className="text-xs text-slate-400">alrod.dev@gmail.com</p>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-slate-700 py-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
