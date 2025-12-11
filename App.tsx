import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ItineraryList } from './pages/ItineraryList';
import { LogList } from './pages/LogList';
import { DetailView } from './pages/DetailView';
import { About } from './pages/About';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16 md:pb-0 pt-0 md:pt-16">
        <Navbar />
        
        <main className="max-w-5xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<ItineraryList />} />
            <Route path="/logs" element={<LogList />} />
            <Route path="/about" element={<About />} />
            
            {/* Dynamic Routes for content */}
            <Route path="/itinerary/:slug" element={<DetailView type="itinerary" />} />
            <Route path="/log/:slug" element={<DetailView type="log" />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;