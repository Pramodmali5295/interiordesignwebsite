import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { fetchContactSettings } from "../services/contactService";

// Custom premium social SVGs to bypass package resolution issues
export const Instagram = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Facebook = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export const Linkedin = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const Youtube = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    async function loadInfo() {
      const data = await fetchContactSettings();
      setContactInfo(data);
    }
    loadInfo();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-400 pt-20 pb-10 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Branding Column */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex flex-col items-start">
            <span className="font-serif text-3xl tracking-widest text-white uppercase">AURA</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-studio-accent">Bespoke Interiors</span>
          </Link>
          <p className="text-sm font-light leading-relaxed pr-4 text-stone-500">
            Crafting silent luxury, tailored sanctuaries, and exceptional commercial architectures globally.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <a href={contactInfo?.social_instagram || "https://instagram.com"} target="_blank" rel="noreferrer" className="text-[#E1306C] hover:text-white transition-colors duration-300">
              <Instagram size={18} />
            </a>
            <a href={contactInfo?.social_facebook || "https://facebook.com"} target="_blank" rel="noreferrer" className="text-[#1877F2] hover:text-white transition-colors duration-300">
              <Facebook size={18} />
            </a>
            <a href={contactInfo?.social_linkedin || "https://linkedin.com"} target="_blank" rel="noreferrer" className="text-[#0A66C2] hover:text-white transition-colors duration-300">
              <Linkedin size={18} />
            </a>
            <a href={contactInfo?.social_youtube || "https://youtube.com"} target="_blank" rel="noreferrer" className="text-[#FF0000] hover:text-white transition-colors duration-300">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div>
          <h4 className="font-serif text-sm text-white tracking-widest uppercase mb-6">Explore</h4>
          <ul className="space-y-3 text-xs tracking-wider uppercase">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">About Studio</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            </li>
            <li>
              <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            </li>
            <li>
              <Link to="/testimonials" className="hover:text-white transition-colors">Client Reviews</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className="font-serif text-sm text-white tracking-widest uppercase mb-6">Studio Info</h4>
          <ul className="space-y-4 text-sm font-light text-stone-500">
            <li>
              <span className="block text-xs uppercase tracking-wider text-stone-600">Address</span>
              {contactInfo?.addressLine1 || "142 Tribeca St, Penthouse B"}<br />
              {contactInfo?.addressLine2 || "New York, NY 10013"}
            </li>
            <li>
              <span className="block text-xs uppercase tracking-wider text-stone-600">Inquiries</span>
              {contactInfo?.email || "hello@aurainteriors.com"}<br />
              {contactInfo?.phone || "+1 (212) 555-8902"}
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm text-white tracking-widest uppercase mb-6">Journal Subscription</h4>
          <p className="text-sm font-light text-stone-500 leading-relaxed">
            Receive exclusive updates, design trend guides, and insights from our founders.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-stone-800 pb-2">
            <Mail size={16} className="text-stone-600 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="bg-transparent text-xs text-white placeholder-stone-600 w-full focus:outline-none tracking-wider"
              required
            />
            <button type="submit" className="hover:text-studio-accent text-stone-500 transition-colors ml-2">
              <ArrowRight size={18} />
            </button>
          </form>
          {subscribed && (
            <span className="text-[11px] text-studio-accent tracking-wider uppercase animate-fade-in">
              Thank you for subscribing.
            </span>
          )}
        </div>
      </div>

      <div className="gold-divider max-w-7xl mx-auto opacity-20 my-8"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-xs font-light text-stone-600 tracking-wider">
        <p>&copy; {new Date().getFullYear()} AURA Design Studio. All Rights Reserved.</p>
        <p className="mt-4 md:mt-0 uppercase flex items-center gap-2">
          <span>Privacy Policy / Terms of Service</span>
          <span>/</span>
          <Link to="/admin" className="hover:text-studio-accent font-medium transition-colors">Studio Access</Link>
        </p>
      </div>
    </footer>
  );
}
