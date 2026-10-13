import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { MissionList } from './pages/MissionList';
import { MissionDetail } from './pages/MissionDetail';
import { DetectiveNotebook } from './pages/DetectiveNotebook';
import { CompilerGuide } from './pages/CompilerGuide';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/peta-misi" element={<MissionList />} />
            <Route path="/misi/:id" element={<MissionDetail />} />
            <Route path="/catatan" element={<DetectiveNotebook />} />
            <Route path="/panduan" element={<CompilerGuide />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
