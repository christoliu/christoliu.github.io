import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchManifest } from '../services/content';
import { Manifest } from '../types';
import clsx from 'clsx';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const LogList: React.FC = () => {
  const [logs, setLogs] = useState<Manifest['logs']>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Tag Expansion State
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [showTagToggle, setShowTagToggle] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchManifest().then(data => {
      setLogs(data.logs);
      setLoading(false);
    });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    logs.forEach(log => log.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [logs]);

  // Check if tags overflow one line
  useEffect(() => {
    if (tagsRef.current) {
      // 40px is slightly more than one row height (approx 32-36px)
      const hasOverflow = tagsRef.current.scrollHeight > 40;
      setShowTagToggle(hasOverflow);
    }
  }, [allTags]);

  const filteredLogs = selectedTag 
    ? logs.filter(log => log.tags.includes(selectedTag))
    : logs;

  // Group Logs by Year
  const logsByYear = useMemo(() => {
    const groups: Record<string, Manifest['logs']> = {};
    
    filteredLogs.forEach(log => {
      const year = new Date(log.date).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(log);
    });

    // Sort years descending (Newest year first)
    const sortedYears = Object.keys(groups).sort((a, b) => Number(b) - Number(a));
    
    return sortedYears.map(year => ({
      year,
      items: groups[year]
    }));
  }, [filteredLogs]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading memories...</div>;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Travel Logs</h1>
        <p className="text-slate-500 mt-2 text-lg">Stories and snapshots from the road.</p>
      </header>

      {/* Tags Filter Section */}
      <div className="mb-10 border-b border-slate-200 pb-6">
        <div className="flex items-start gap-4">
          <div 
            ref={tagsRef}
            className={clsx(
              "flex flex-wrap gap-2 transition-all duration-500 ease-in-out overflow-hidden",
              isTagsExpanded ? "max-h-[500px]" : "max-h-[36px]" // 36px restricts to exactly one line of buttons
            )}
          >
            <button
              onClick={() => setSelectedTag(null)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors h-[34px] whitespace-nowrap",
                !selectedTag ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={clsx(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors h-[34px] whitespace-nowrap",
                  tag === selectedTag ? "bg-indigo-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
          
          {showTagToggle && (
            <button 
              onClick={() => setIsTagsExpanded(!isTagsExpanded)}
              className="shrink-0 p-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors mt-0.5"
              title={isTagsExpanded ? "Show less" : "Show more"}
            >
              {isTagsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Grouped Logs Section */}
      <div className="space-y-16">
        {logsByYear.map(({ year, items }) => (
          <section key={year} className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-slate-500">
                {year}
              </h2>
              <div className="h-px bg-slate-200 flex-1 rounded-full mt-1" />
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {items.map((log) => (
                <div 
                  key={log.slug}
                  onClick={() => navigate(`/log/${log.slug}`, { state: { path: log.path, meta: log } })}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer flex flex-col md:flex-row hover:shadow-lg transition-all duration-300"
                >
                  <div className="md:w-1/3 h-56 md:h-auto relative bg-slate-100">
                     <ImageWithFallback 
                      src={log.coverImage} 
                      alt={log.title}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {log.tags.map(t => (
                        <span key={t} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                      {log.title}
                    </h3>
                    <div className="flex items-center text-slate-400 text-sm mt-2">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {log.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {logsByYear.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No logs found for this tag.
          </div>
        )}
      </div>
    </div>
  );
};