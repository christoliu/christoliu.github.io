import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Map, BookOpen, Compass } from 'lucide-react';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "flex flex-col md:flex-row items-center justify-center px-4 py-2 md:py-1 rounded-lg transition-all duration-200",
      isActive 
        ? "text-indigo-600 bg-indigo-50 font-bold" 
        : "text-slate-500 hover:text-indigo-500 hover:bg-slate-50"
    );

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 md:top-0 md:bottom-auto md:border-t-0 md:border-b shadow-lg md:shadow-sm z-50">
      {/* 
        Updated Container to match App.tsx main container:
        - max-w-5xl (was max-w-4xl)
        - px-4 md:px-8 (was just px-4, matches App's p-4 md:p-8)
      */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Clickable to About Page */}
        <Link 
          to="/about" 
          className="hidden md:flex items-center gap-2 font-bold text-xl text-slate-800 hover:text-indigo-600 transition-colors"
          title="About Me"
        >
          <Compass className="w-6 h-6 text-indigo-600" />
          <span>TravelJournal</span>
        </Link>

        {/* Mobile View - Top Bar Title (Optional, if you want it visible on mobile top) */}
        {/* Currently the design only has bottom nav for mobile, so this Link only shows on Desktop */}

        <div className="flex w-full md:w-auto justify-around md:gap-4">
          <NavLink to="/" className={navItemClass} end>
            <Map className="w-6 h-6 md:w-5 md:h-5 md:mr-2" />
            <span className="text-xs md:text-sm">Itineraries</span>
          </NavLink>
          
          <NavLink to="/logs" className={navItemClass}>
            <BookOpen className="w-6 h-6 md:w-5 md:h-5 md:mr-2" />
            <span className="text-xs md:text-sm">Logs</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};