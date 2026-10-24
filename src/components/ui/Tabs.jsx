import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const TabsContext = createContext(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const currentTab = value !== undefined ? value : activeTab;

  const handleTabChange = (val) => {
    if (value === undefined) {
      setActiveTab(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ currentTab, handleTabChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-xl max-w-full overflow-x-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  icon,
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { currentTab, handleTabChange } = context;
  const isSelected = currentTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => handleTabChange(value)}
      className={cn(
        'relative flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-semibold transition-colors rounded-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        isSelected ? 'text-primary-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60',
        className
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 bg-white border border-slate-200/90 rounded-lg shadow-xs"
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {children}
      </span>
    </button>
  );
}

export function TabsContent({ value, className, children }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { currentTab } = context;
  if (currentTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('focus-visible:outline-none pt-2', className)}
    >
      {children}
    </div>
  );
}
