import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import StoryPopup from './StoryPopup';

export default function StoriesSection() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      const snapshot = await getDocs(collection(db, 'stories'));
      const now = new Date();
      
      const storiesList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(story => {
          // Keep if no expiry or expiry is in future
          if (!story.expiryDate) return true;
          return new Date(story.expiryDate) > now;
        })
        .sort((a, b) => {
          // Sort by eventDate ascending (earliest first)
          return new Date(a.eventDate) - new Date(b.eventDate);
        });

      setStories(storiesList);
    };
    fetchStories();
  }, []);

  const handleAddStoryClick = () => {
    navigate('/add-story');
  };

  return (
    <>
      <section className="mx-4 mb-5">
        <h3 className="text-white text-xl font-bold mb-4">Stories</h3>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {/* Add Story Tile */}
          <div
            className="flex-shrink-0 w-60 h-80 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-[3px] cursor-pointer group"
            onClick={handleAddStoryClick}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-black/50 group-hover:bg-black/30 transition">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-dashed border-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-white font-medium">Add Story</p>
              <p className="text-gray-400 text-sm mt-1">Upload a poster</p>
            </div>
          </div>

          {/* Real Stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex-shrink-0 w-60 h-80 rounded-2xl bg-gradient-to-br from-[#b50380] to-[#ba4e96] p-[3px] cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-end justify-start bg-black">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full h-2/5 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <p className="absolute bottom-2 left-2 z-20 text-white font-bold text-base drop-shadow">
                  {story.name}
                </p>
                {/* Optional: Show event date badge */}
                {story.eventDate && (
                  <span className="absolute top-2 right-2 z-20 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {new Date(story.eventDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedStory && (
        <StoryPopup story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
    </>
  );
}