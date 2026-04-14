import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, analytics } from '../firebase/config';
import { logEvent } from 'firebase/analytics';

export default function AddStory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    eventDate: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate next available document ID
  const generateStoryId = async (eventDate) => {
    // Format date as DDMMYY
    const date = new Date(eventDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const prefix = `${day}${month}${year}`;

    // Get all existing stories with this prefix
    const storiesRef = collection(db, 'stories');
    const snapshot = await getDocs(storiesRef);
    const existingIds = snapshot.docs.map(doc => doc.id);
    
    // Find highest suffix for this prefix
    let maxSuffix = 0;
    existingIds.forEach(id => {
      if (id.startsWith(prefix)) {
        const suffix = parseInt(id.slice(-2), 10);
        if (!isNaN(suffix) && suffix > maxSuffix) {
          maxSuffix = suffix;
        }
      }
    });

    const nextSuffix = String(maxSuffix + 1).padStart(2, '0');
    return `${prefix}${nextSuffix}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Set default expiry to 7 days after event if not provided
      let expiryDate = formData.expiryDate;
      if (!expiryDate && formData.eventDate) {
        const eventDate = new Date(formData.eventDate);
        eventDate.setDate(eventDate.getDate() + 7);
        expiryDate = eventDate.toISOString().split('T')[0];
      }

      const customId = await generateStoryId(formData.eventDate);

      await setDoc(doc(db, 'stories', customId), {
        name: formData.name,
        image: formData.image,
        eventDate: new Date(formData.eventDate).toISOString(),
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        createdAt: new Date().toISOString(),
      });

      if (analytics) {
        logEvent(analytics, 'story_added', {
          story_name: formData.name,
          event_date: formData.eventDate,
        });
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00002B] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Add New Story / Poster</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Story Title *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Welcome Week 2026"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Poster Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/poster.jpg"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Event Date *</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Expiry Date (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date (optional)</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Story will stop showing after this date. Defaults to 7 days after event.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-black font-bold py-2 px-6 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Story'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}