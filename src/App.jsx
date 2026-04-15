import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StoriesSection from './components/StoriesSection';
import TileSection from './components/TileSection';
import Footer from './components/Footer';
import { fetchAllTiles } from './services/tilesService';
import { Routes, Route } from 'react-router-dom';
import AddListing from './pages/AddListing';
import AddStory from './pages/AddStory';


function App() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllTiles();
        setAllItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter data for each section (same as before)
  const recommended = allItems.slice(0, 7);
  const clubs = allItems.filter(item => item.category === 'clubs');
  const vendors = allItems.filter(item => item.category === 'vendor');
  const resources = allItems.filter(item => item.category === 'resources');
  const others = allItems.filter(item => item.category === 'other');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00002B] flex items-center justify-center">
        <p className="text-white text-xl">Loading UWI Central Hub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#00002B] flex items-center justify-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#00002B] text-white font-sans">
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Hero />
            <StoriesSection />
            <TileSection title="Recommended" items={recommended} />
            <TileSection title="Clubs / Societies" items={clubs} />
            <TileSection title="Vendors" items={vendors} />
            <TileSection title="Resources" items={resources} />
            <TileSection title="Others" items={others} />
            <Footer />
          </>
        } />
        <Route path="/add" element={<AddListing />} />
        <Route path="/add-story" element={<AddStory />} />
      </Routes>
    </div>
    
  );
}

export default App;