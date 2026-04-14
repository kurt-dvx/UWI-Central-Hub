import { Link } from 'react-router-dom';
import heroImage from '../assets/UWIWall.jpg';

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        src={heroImage}
        alt="UWI Campus"
        className="w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00002B] via-[#00072F]/80 via-[#000D32]/40 via-[#001433]/20 to-[#001A33]/10 z-0" />
      
      {/* Text content */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4">
        <p className="text-white mb-2">Welcome to</p>
        <h2 className="text-5xl font-extrabold text-white mb-2">UWI Central HUB</h2>
        <p className="text-white mb-6">All Things UWI</p>
        <Link to="/add">
          <button className="bg-orange-500 text-black font-bold py-2 px-6 rounded-md hover:bg-orange-600 transition">
            Add Profile
          </button>
        </Link>
      </div>
    </section>
  );
}