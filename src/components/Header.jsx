import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-black flex justify-between items-center px-5 py-3 shadow-[0_5px_20px_rgba(255,255,255,0.1)]">
      <h2 className="text-orange-500 font-bold text-xl">UCH</h2>
      <Link
        to="/add"
        className="bg-orange-500 text-black font-bold py-1 px-4 rounded-md hover:bg-orange-600 transition"
      >
        Add Listing
      </Link>
    </header>
  );
}