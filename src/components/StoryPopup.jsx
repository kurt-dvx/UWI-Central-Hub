export default function StoryPopup({ story, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-40 backdrop-blur-md" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative max-w-[90vw] max-h-[90vh]">
          <img
            src={story.image}
            alt={story.name}
            className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
            <p className="text-white text-lg font-medium text-center">
              {story.name}
            </p>
            {story.eventDate && (
              <p className="text-gray-300 text-sm text-center mt-1">
                {new Date(story.eventDate).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}