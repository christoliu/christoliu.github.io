import React from 'react';
import { MapPin, Mail, Instagram, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const About: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="relative mt-8 mb-4">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            <ImageWithFallback 
              src="resources/images/avatar.jpg" 
              fallbackText="ME"
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Travel Journal</h1>
        <p className="text-slate-500 mb-6 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" /> World Explorer
        </p>
        
        <p className="text-slate-600 leading-relaxed mb-8 max-w-lg mx-auto">
          Hi there! Welcome to my digital travel diary. I built this space to document my adventures, 
          share itineraries, and keep track of the beautiful places I've visited. 
          I love photography, hiking, and finding the best coffee in every city.
        </p>

        {/* Social Links (Demo) */}
        <div className="flex justify-center gap-4">
          <a href="#" className="p-3 bg-slate-50 rounded-full text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 bg-slate-50 rounded-full text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <Globe className="w-5 h-5" />
          </a>
          <a href="mailto:hello@example.com" className="p-3 bg-slate-50 rounded-full text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Stats or Info Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">12</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Countries</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">45</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cities</div>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
        <h3 className="font-bold text-indigo-900 mb-2">Want to use this template?</h3>
        <p className="text-indigo-700 text-sm mb-4">
          This PWA is built with React and Tailwind. You can host it on GitHub Pages for free!
        </p>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};