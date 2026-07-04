import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-stone-900/90 backdrop-blur-md border-b border-stone-800 py-4 shadow-lg text-white"
          : "bg-transparent py-6 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="font-serif text-2xl tracking-widest uppercase transition-colors group-hover:text-studio-accent">
            AURA
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 group-hover:text-stone-300 transition-colors">
            Bespoke Interiors
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-sans text-xs tracking-widest uppercase transition-colors relative py-2 ${
                  isActive
                    ? "text-studio-accent"
                    : "text-stone-300 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-studio-accent animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* CTA Button Desktop */}
        <div className="hidden md:block">
          <Link
            to="/contact"
            className={`border px-6 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${
              isScrolled
                ? "border-studio-accent text-studio-accent hover:bg-studio-accent hover:text-stone-900"
                : "border-white/40 text-white hover:bg-white hover:text-stone-900"
            }`}
          >
            Consultation
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1 text-stone-300 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-full bg-stone-950/95 backdrop-blur-lg flex flex-col justify-center items-center space-y-8 z-40 transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button Inside Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 text-stone-400 hover:text-white"
        >
          <X size={28} />
        </button>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col items-center space-y-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `font-serif text-2xl tracking-widest uppercase transition-colors ${
                  isActive ? "text-studio-accent" : "text-stone-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 border border-studio-accent text-studio-accent px-8 py-3 text-sm tracking-widest uppercase hover:bg-studio-accent hover:text-stone-900 transition-all duration-300"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </nav>
  );
}
