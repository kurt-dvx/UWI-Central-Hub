export default function Popup({ data, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Card - solid background, fixed width constraints */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl max-h-[90vh] bg-[#0a0a2e] rounded-2xl shadow-2xl border border-gray-800 z-50 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {/* Image - full width, fixed height */}
          <div className="w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden">
            <img
              src={data.picture || data.image}
              alt={data.name || data.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-2 text-center">
            {data.name || data.title}
          </h2>

          {/* Category Badge */}
          {data.category && (
            <div className="flex justify-center mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium text-orange-300 bg-orange-500/20 rounded-full border border-orange-500/30">
                {data.category}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap text-center">
              {data.description}
            </p>
          </div>

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <div className="border-t border-gray-800 pt-6 mt-4">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 text-center">
                Links
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {data.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-200"
                  >
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      {link.label.toLowerCase().includes('instagram') && '📷'}
                      {link.label.toLowerCase().includes('website') && '🌐'}
                      {link.label.toLowerCase().includes('discord') && '💬'}
                      {link.label.toLowerCase().includes('twitter') && '🐦'}
                      {link.label.toLowerCase().includes('facebook') && '📘'}
                      {!['instagram','website','discord','twitter','facebook'].some(s => link.label.toLowerCase().includes(s)) && '🔗'}
                    </span>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}