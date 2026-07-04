import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { Instagram, Facebook, Youtube } from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans relative">
      <ScrollToTop />
      <Navbar />
      
      {/* Floating Social Media Bar (Center Right) */}
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-5 bg-stone-950/80 backdrop-blur-md px-2.5 py-6 rounded-full border border-stone-900 shadow-2xl">
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[#E1306C] hover:text-white hover:scale-110 transition-all duration-300 p-1.5"
          title="Instagram"
        >
          <Instagram size={18} />
        </a>
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[#1877F2] hover:text-white hover:scale-110 transition-all duration-300 p-1.5"
          title="Facebook"
        >
          <Facebook size={18} />
        </a>
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noreferrer" 
          className="text-[#FF0000] hover:text-white hover:scale-110 transition-all duration-300 p-1.5"
          title="YouTube"
        >
          <Youtube size={18} />
        </a>
      </div>

      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
