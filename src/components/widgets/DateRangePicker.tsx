/**
 * Date range picker component
 */

'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from 'date-fns';
import type { DateRange } from '@/types';

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  maxDays?: number;
}

const PRESET_RANGES = [
  {
    label: 'Last 7 days',
    getDates: () => {
      const to = new Date();
      const from = new Date(to);
      from.setDate(from.getDate() - 7);
      return { from, to };
    },
  },
  {
    label: 'Last 30 days',
    getDates: () => {
      const to = new Date();
      const from = new Date(to);
      from.setDate(from.getDate() - 30);
      return { from, to };
    },
  },
  {
    label: 'Last 90 days',
    getDates: () => {
      const to = new Date();
      const from = new Date(to);
      from.setDate(from.getDate() - 90);
      return { from, to };
    },
  },
  {
    label: 'Year to date',
    getDates: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), 0, 1);
      return { from, to };
    },
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  maxDays = 365,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localRange, setLocalRange] = useState<DateRange>(
    value || PRESET_RANGES[0].getDates()
  );

  const handlePreset = (range: DateRange) => {
    setLocalRange(range);
    onChange?.(range);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 hover:border-slate-500 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm">
          {formatDate(localRange.from, 'MMM d')} - {formatDate(localRange.to, 'MMM d')}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden min-w-[200px]"
          >
            <div className="p-3 space-y-2">
              {PRESET_RANGES.map((preset) => {
                const range = preset.getDates();
                return (
                  <button
                    key={preset.label}
                    onClick={() => handlePreset(range)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
