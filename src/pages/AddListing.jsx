import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, analytics } from '../firebase/config';
import { logEvent } from 'firebase/analytics';

export default function AddListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'clubs',
    description: '',
    picture: '',
    links: [{ url: '', label: '' }], // Start with one empty link
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['clubs', 'vendor', 'resources', 'other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle link field changes
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, links: updatedLinks });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { url: '', label: '' }],
    });
  };

  const removeLink = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Filter out empty links
    const validLinks = formData.links.filter(link => link.url.trim() !== '' && link.label.trim() !== '');

    try {
      const docRef = await addDoc(collection(db, 'tilesdata'), {
        ...formData,
        links: validLinks,
        createdAt: new Date().toISOString(),
      });

      if (analytics) {
        logEvent(analytics, 'listing_added', {
          listing_name: formData.name,
          category: formData.category,
          links_count: validLinks.length,
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
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Add Listing</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL *</label>
            <input
              type="url"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Links Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Links (Optional)</label>
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Label (e.g., Instagram)"
                  value={link.label}
                  onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formData.links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="mt-2 text-sm text-orange-400 hover:text-orange-300"
            >
              + Add another link
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-black font-bold py-2 px-6 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Listing'}
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