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
              src="/images/avatar.png"
              fallbackText="ME"
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Penny & Christo</h1>
        <p className="text-slate-500 mb-6 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" /> World Explorer
        </p>

        <p className="text-slate-600 leading-relaxed mb-8 max-w-lg mx-auto">
          Hi there! Welcome to our travel diary. We created this space to capture our journeys, share travel plans, and
          remember the beautiful places along the way. Photography, nature, and the thrill of the unknown inspire every
          trip we take.
        </p>

        {/* Social Links (Demo) */}
        <div className="flex justify-center gap-4">
          <a
            href="https://www.instagram.com/pan___03/"
            className="p-3 bg-slate-50 rounded-full text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/christo_0214/"
            className="p-3 bg-slate-50 rounded-full text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Stats or Info Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">9</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Countries</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">17</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cities</div>
        </div>
      </div>
    </div>
  );
};
