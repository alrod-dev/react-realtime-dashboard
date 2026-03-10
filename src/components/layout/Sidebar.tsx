/**
 * Collapsible sidebar navigation component
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: 'Users',
    href: '/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Revenue',
    href: '/revenue',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useDashboardStore();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-200 hover:bg-slate-700 transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -256,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="lg:relative lg:translate-x-0 fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 z-40 overflow-y-auto"
      >
        {/* Logo/Header */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700 px-4">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline text-sm font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <div className="text-xs text-slate-500 text-center">
            Alfredo Wiesner
            <br />
            Senior Engineer
          </div>
        </div>
      </motion.aside>

      {/* Close sidebar on mobile when navigating */}
      {typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.innerWidth < 1024) {
                document.querySelectorAll('[href]').forEach(link => {
                  link.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('closeSidebar'));
                  });
                });
              }
            `,
          }}
        />
      )}
    </>
  );
};
