import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, ChevronDown, ChevronUp, Plane } from 'lucide-react';
import { fetchManifest } from '../services/content';
import { Manifest } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

const INITIAL_DISPLAY_COUNT = 4;

export const ItineraryList: React.FC = () => {
  const [itineraries, setItineraries] = useState<Manifest['itineraries']>([]);
  const [loading, setLoading] = useState(true);
  
  // Fold states
  const [expandUpcoming, setExpandUpcoming] = useState(false);
  const [expandPast, setExpandPast] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchManifest().then(data => {
      setItineraries(data.itineraries);
      setLoading(false);
    });
  }, []);

  // Filter and Sort Logic
  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize today to midnight for comparison

    const upcomingList: Manifest['itineraries'] = [];
    const pastList: Manifest['itineraries'] = [];

    itineraries.forEach(item => {
      const itemDate = new Date(item.date);
      if (itemDate >= now) {
        upcomingList.push(item);
      } else {
        pastList.push(item);
      }
    });

    // Sort Upcoming: Nearest date first (Ascending)
    upcomingList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Sort Past: Most recent date first (Descending)
    pastList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming: upcomingList, past: pastList };
  }, [itineraries]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading adventures...</div>;
  }

  // Reusable Section Renderer
  const renderSection = (
    title: string, 
    items: Manifest['itineraries'], 
    isExpanded: boolean, 
    toggleExpand: () => void,
    isUpcoming: boolean
  ) => {
    if (items.length === 0) {
      if (isUpcoming) {
        return (
          <div className="mb-12 text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
            <Plane className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-500 font-medium">No upcoming trips planned yet.</h3>
            <p className="text-slate-400 text-sm">Time to start a new adventure!</p>
          </div>
        );
      }
      return null;
    }

    const visibleItems = isExpanded ? items : items.slice(0, INITIAL_DISPLAY_COUNT);
    const hasMore = items.length > INITIAL_DISPLAY_COUNT;

    return (
      <section className="animate-fade-in">
        {/* Section Header with improved alignment and styling */}
        <header className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-500 whitespace-nowrap">
              {title}
            </h2>
            {/* Added mt-1.5 to push the badge down visually to align with text baseline */}
            <span className="flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full min-w-[1.5rem] h-6 mt-1.5">
              {items.length}
            </span>
          </div>
          <div className="h-px bg-slate-200 flex-1 rounded-full mt-2" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleItems.map((item) => (
            <div 
              key={item.slug}
              onClick={() => navigate(`/itinerary/${item.slug}`, { state: { path: item.path, meta: item } })}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="h-56 relative bg-slate-100">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 pointer-events-none" />
                <ImageWithFallback 
                  src={item.coverImage} 
                  alt={item.title}
                  className="w-full h-full"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  {item.date}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                  {item.title}
                </h3>
                <div className="mt-auto pt-4 flex items-center text-slate-400 text-sm font-medium group-hover:text-indigo-500">
                  View Plan <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 text-center relative z-10">
            <button 
              onClick={toggleExpand}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm font-bold text-sm"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show All ({items.length}) <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </section>
    );
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Itineraries</h1>
        <p className="text-lg text-slate-500 mt-3">A collection of adventures planned and memories made.</p>
      </header>

      {/* Upcoming Section */}
      {renderSection(
        "Upcoming Adventures", 
        upcoming, 
        expandUpcoming, 
        () => setExpandUpcoming(!expandUpcoming),
        true
      )}

      {/* Explicit Spacer between sections - Reduced from h-32 to h-16 */}
      {upcoming.length > 0 && past.length > 0 && (
        <div className="h-16 w-full" aria-hidden="true" />
      )}

      {/* Past Section */}
      {renderSection(
        "Past Journeys", 
        past, 
        expandPast, 
        () => setExpandPast(!expandPast),
        false
      )}
      
      {/* Bottom spacer */}
      <div className="h-20" />
    </div>
  );
};