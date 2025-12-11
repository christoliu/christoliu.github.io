import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { fetchContent, fetchManifest } from '../services/content';
import { MarkdownView } from '../components/MarkdownView';
import { ItineraryJson } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const DetailView: React.FC<{ type: 'log' | 'itinerary' }> = ({ type }) => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [data, setData] = useState<{ meta: any; content: any; isJson: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      let path = location.state?.path;
      let itemMeta = location.state?.meta;

      // If accessed directly (e.g. refresh), we need to find the correct path/extension from manifest
      if (!path && slug) {
        try {
          const manifest = await fetchManifest();
          const collection = type === 'log' ? manifest.logs : manifest.itineraries;
          const found = collection.find(item => item.slug === slug);
          
          if (found) {
            path = found.path;
            itemMeta = found; // Store meta to use if file content doesn't have it
          } else {
            // Fallback guess if manifest lookup fails or item not found
            path = `resources/${type === 'log' ? 'logs' : 'itineraries'}/${slug}.${type === 'itinerary' ? 'json' : 'md'}`;
          }
        } catch (e) {
          console.warn("Manifest lookup failed during detail load", e);
        }
      }

      if (!path) path = 'mock';

      try {
        const result = await fetchContent(path);
        // Merge manifest meta with file meta (file meta takes precedence if exists)
        const finalMeta = { ...itemMeta, ...result.meta };
        setData({ ...result, meta: finalMeta });
      } catch (err) {
        console.error(err);
        setError("Could not load content. Check if file exists in resources folder and manifest.json is correct.");
      }
    };

    loadContent();
  }, [slug, location.state, type]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-600 underline">Go Back</button>
      </div>
    );
  }

  if (!data) return <div className="p-20 text-center text-slate-400">Loading...</div>;

  const { meta, content, isJson } = data;

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm pb-20">
      {/* Hero Header */}
      <div className="relative h-64 md:h-96 w-full bg-slate-200">
        <ImageWithFallback 
          src={meta.coverImage || meta.image} 
          alt={meta.title}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm">{meta.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90">
             {meta.date && (
               <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5"/> {meta.date}</span>
             )}
             {meta.location && (
               <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5"/> {meta.location}</span>
             )}
             {meta.duration && (
               <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5"/> {meta.duration}</span>
             )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-6 py-8 md:px-10">
        {isJson ? (
          <ItineraryRenderer data={content as ItineraryJson} />
        ) : (
          <MarkdownView content={content as string} />
        )}
      </div>
    </div>
  );
};

// Sub-component to render structured JSON itineraries
const ItineraryRenderer: React.FC<{ data: ItineraryJson }> = ({ data }) => {
  if (!data.days) return <div>No schedule data available.</div>;

  return (
    <div className="space-y-12 relative border-l-2 border-slate-200 ml-3 md:ml-6 pl-8 md:pl-12">
      {data.days.map((day, idx) => (
        <div key={idx} className="relative">
          {/* Timeline Dot */}
          <div className="absolute -left-[41px] md:-left-[57px] top-0 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shadow-sm flex items-center justify-center text-xs font-bold text-white">
            {day.day}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Day {day.day}: {day.title}</h2>
          <p className="text-slate-600 mb-4">{day.description}</p>
          
          {day.image && (
            <div className="h-48 md:h-64 mb-4 rounded-xl overflow-hidden shadow-sm">
              <ImageWithFallback 
                src={day.image} 
                alt={day.title} 
                className="w-full h-full" 
              />
            </div>
          )}

          {day.places && day.places.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stops</h4>
              <ul className="space-y-2">
                {day.places.map((place, i) => (
                  <li key={i} className="flex items-start text-slate-700">
                    <MapPin className="w-4 h-4 text-indigo-500 mr-2 mt-1 shrink-0" />
                    {place}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};