import { useState } from 'react';
import Tile from './Tile';
import Popup from './Popup';

export default function TileSection({ title, items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      <section className="mb-8">
        <div className="flex items-center mx-5 mb-2">
          <h3 className="text-white text-xl font-bold mr-3">{title}</h3>
          <p className="text-white text-sm mr-1">See More</p>
          <span className="text-white text-xl">→</span>
        </div>
        <div className="flex flex-wrap">
          {items.map((item) => (
            <Tile key={item.id} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      </section>

      {selectedItem && (
        <Popup data={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}