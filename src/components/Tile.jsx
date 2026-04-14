import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';

export default function Tile({ item, onClick }) {

  const handleClick = () => {
    // Track the click event
    if (analytics) {
      logEvent(analytics, 'tile_click', {
        tile_name: item.name,
        tile_category: item.category,
        tile_id: item.id,
      });
    }
    // Call the parent onClick to open popup
    onClick(item);
  };

  return (
    <div
      className="relative w-[calc(50%-10px)] md:w-64 h-64 md:h-72 mx-[5px] mb-5 rounded-2xl overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={item.picture}
        alt={item.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00002B]/80 via-[#00072F]/70 via-[#000D32]/50 via-[#001433]/20 to-[#001A33]/10" />
      <div className="absolute bottom-2 left-4 z-10">
        <h3 className="text-white text-lg font-bold">{item.name}</h3>
      </div>
    </div>
  );
}