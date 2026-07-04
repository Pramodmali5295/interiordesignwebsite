import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight, Compass, Home as HomeIcon, Briefcase, LayoutGrid, Hammer, Layers } from "lucide-react";
import { fetchProjects } from "../../services/portfolioService";
import { fetchServices } from "../../services/serviceService";

export default function Home() {
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);
  const heroDividerRef = useRef(null);
  const bgImageRef = useRef(null);

  const [hoveredService, setHoveredService] = useState(0);
  const [projectsList, setProjectsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GSAP Entrance Animations
    const tl = gsap.timeline();
    
    // Scale background image slowly
    tl.fromTo(
      bgImageRef.current,
      { scale: 1.15, filter: "brightness(0.2)" },
      { scale: 1.0, filter: "brightness(0.35)", duration: 2.5, ease: "power2.out" }
    );

    // Stagger text and draw line
    tl.fromTo(
      heroTitleRef.current.children,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" },
      "-=1.8"
    );

    tl.fromTo(
      heroDividerRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.0, ease: "power2.inOut" },
      "-=1.2"
    );

    tl.fromTo(
      [heroSubRef.current, heroBtnRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, stagger: 0.2, ease: "power3.out" },
      "-=0.6"
    );
  }, []);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [projData, servData] = await Promise.all([
          fetchProjects(),
          fetchServices(),
        ]);
        setProjectsList(projData);
        setServicesList(servData);
      } catch (err) {
        console.error("Error loading home page database content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Limit items for preview
  const featuredServices = servicesList.slice(0, 3);
  const featuredProjects = projectsList.slice(0, 4);

  // Icon mapping helper
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Home":
        return <HomeIcon className="stroke-[1px]" size={36} />;
      case "Briefcase":
        return <Briefcase className="stroke-[1px]" size={36} />;
      case "LayoutGrid":
        return <LayoutGrid className="stroke-[1px]" size={36} />;
      case "Compass":
        return <Compass className="stroke-[1px]" size={36} />;
      case "Hammer":
        return <Hammer className="stroke-[1px]" size={36} />;
      case "Layers":
        return <Layers className="stroke-[1px]" size={36} />;
      default:
        return <Compass className="stroke-[1px]" size={36} />;
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-950">
        {/* Hero Background Image */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        
        {/* Hero Overlay Context */}
        <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
          <div ref={heroTitleRef} className="overflow-hidden mb-4">
            <h1 className="text-white text-5xl md:text-8xl leading-tight uppercase font-serif tracking-widest font-light">
              Bespoke Luxury
            </h1>
            <h1 className="text-white/80 text-4xl md:text-7xl leading-tight uppercase font-serif tracking-widest font-light -mt-2">
              For Silent Living
            </h1>
          </div>

          {/* Luxury Divider */}
          <div
            ref={heroDividerRef}
            className="w-32 h-[1px] bg-studio-accent origin-center mb-8"
          />

          <p
            ref={heroSubRef}
            className="text-stone-300 font-sans font-light tracking-[0.2em] text-xs md:text-sm uppercase max-w-xl leading-relaxed mb-10"
          >
            AURA designs interior architecture that balances raw textures with elegant simplicity, crafting spaces that speak in whispers.
          </p>

          <div ref={heroBtnRef}>
            <Link
              to="/portfolio"
              className="group relative inline-flex items-center justify-center bg-studio-accent text-stone-950 px-8 py-3.5 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-white">
                Explore Studio Works
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
          <span className="text-[9px] text-stone-500 tracking-[0.3em] uppercase mb-2">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-stone-500 to-transparent" />
        </div>
      </section>

      {/* Intro & Philosophy Teaser */}
      <section className="py-24 md:py-36 bg-studio-light border-b border-stone-200" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-6">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 leading-snug mb-8 font-light">
            “The details are not the details.<br />They make the design.”
          </h2>
          <div className="gold-divider mb-8" />
          <p className="text-stone-600 font-light leading-relaxed max-w-2xl mx-auto text-base md:text-lg mb-10">
            We believe that premium spaces should not demand attention; instead, they command presence. Through the tactile interplay of limestone, raw walnut, and antique brass, we design sanctuaries tailored for functional ease and sensory peace.
          </p>
          <div className="flex justify-center mt-6">
            <Link
              to="/about"
              className="group relative inline-flex items-center justify-center bg-stone-900 text-white px-8 py-3.5 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden shadow-md"
            >
              <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-stone-950">
                Discover Our Story
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-studio-accent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Design Pillars Section */}
      <section className="py-24 md:py-36 bg-studio-sand text-stone-900 overflow-hidden border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20" data-aos="fade-up">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-4">What We Do</span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-stone-900 uppercase tracking-wider">Design Pillars</h2>
            </div>
            <Link
              to="/services"
              className="group relative inline-flex items-center justify-center bg-stone-900 text-white px-8 py-3.5 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden mt-6 md:mt-0 shadow-md"
            >
              <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-stone-950">
                All Services
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-studio-accent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
            </Link>
          </div>

          {/* Interactive Split Columns */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center animate-pulse">
              <div className="lg:col-span-7 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="border-b border-stone-200/40 py-6">
                    <div className="h-7 bg-stone-200 w-2/3" />
                  </div>
                ))}
              </div>
              <div className="lg:col-span-5 hidden lg:block aspect-[4/5] bg-stone-200" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Left Column: Interactive List */}
              <div className="lg:col-span-7 space-y-2">
                {featuredServices.map((service, index) => (
                  <div
                    key={service.id}
                    onMouseEnter={() => setHoveredService(index)}
                    className={`border-b py-6 cursor-pointer transition-all duration-300 group/item ${
                      hoveredService === index ? "border-studio-accent" : "border-stone-200"
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      {/* Index Number */}
                      <span className={`font-serif text-xl md:text-2xl transition-colors duration-300 ${
                        hoveredService === index ? "text-studio-accent" : "text-stone-400"
                      }`}>
                        0{index + 1}
                      </span>
                      
                      {/* Text content block */}
                      <div className="flex-1">
                        <h3 className={`text-2xl md:text-3xl font-serif tracking-wide transition-colors duration-300 ${
                          hoveredService === index ? "text-studio-accent" : "text-stone-800"
                        }`}>
                          {service.title}
                        </h3>
                        
                        {/* Height and Opacity transition */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          hoveredService === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                        }`}>
                          <div className="overflow-hidden">
                            <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed max-w-xl">
                              {service.shortDesc}
                            </p>
                            <Link 
                              to="/services" 
                              className="group relative inline-flex items-center justify-center bg-stone-900 text-white px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden mt-6 shadow-sm"
                            >
                              <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-stone-950">
                                Explore Pillar Details
                                <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                              </span>
                              <span className="absolute inset-0 bg-studio-accent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Image Preview (Desktop Only) */}
              <div className="lg:col-span-5 hidden lg:block" data-aos="fade-left">
                <div className="relative aspect-[4/5] bg-stone-900 border border-studio-accent/20 overflow-hidden shadow-2xl p-4">
                  <div className="absolute inset-0 border border-studio-accent/15 m-3 z-10 pointer-events-none" />
                  {featuredServices.map((service, index) => (
                    <div
                      key={service.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        hoveredService === index ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="object-cover w-full h-full brightness-[0.7]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile View Image Frame (Small Screens Only) */}
              <div className="block lg:hidden mt-4" data-aos="fade-up">
                <div className="aspect-[4/3] bg-stone-900 relative overflow-hidden shadow-xl border border-stone-200">
                  {featuredServices[hoveredService] && (
                    <img
                      src={featuredServices[hoveredService].image}
                      alt={featuredServices[hoveredService].title}
                      className="object-cover w-full h-full transition-all duration-500 brightness-[0.75]"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Grid Section */}
      <section className="py-24 md:py-36 bg-studio-light border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16" data-aos="fade-up">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">Selected Works</span>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 font-light">Featured Portfolios</h2>
            </div>
            <Link
              to="/portfolio"
              className="group relative inline-flex items-center justify-center bg-stone-900 text-white px-8 py-3.5 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden mt-4 md:mt-0 shadow-md"
            >
              <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-stone-950">
                Browse Gallery
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-studio-accent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col space-y-4">
                  <div className="aspect-[3/2] bg-stone-150 border border-stone-200/40" />
                  <div className="flex justify-between items-start pt-2">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-stone-200 w-2/3" />
                      <div className="h-3 bg-stone-100 w-1/4 mt-2" />
                    </div>
                    <div className="h-4 bg-stone-100 w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group flex flex-col space-y-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-stone-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-luxury duration-700 brightness-[0.95]"
                    />
                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/45 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs tracking-widest uppercase border border-white/50 px-6 py-2 backdrop-blur-sm">
                        View Details
                      </span>
                    </div>
                  </div>
                  {/* Meta details */}
                  <div className="flex justify-between items-start pt-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-serif text-stone-900 group-hover:text-studio-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">
                        {project.category}
                      </p>
                    </div>
                    <span className="text-xs font-serif text-stone-400 italic">
                      {project.location}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Luxury Consulting CTA Banner */}
      <section className="relative py-32 bg-stone-950 text-center overflow-hidden">
        {/* Background texture or overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 opacity-80" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.4em] text-studio-accent block mb-6 animate-pulse">Bespoke Design Commissions</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white font-light uppercase tracking-wider mb-8">
            Create Your Sanctuary
          </h2>
          <div className="gold-divider opacity-30 mb-8" />
          <p className="text-stone-400 font-light leading-relaxed max-w-xl mb-12 text-sm md:text-base">
            Whether you are designing a high-end Tribeca penthouse, a beachfront retreat, or an inspiring corporate headquarters, our design team is ready to conceptualize your vision.
          </p>
          <Link
            to="/contact"
            className="group relative inline-flex items-center justify-center bg-studio-accent text-stone-950 px-10 py-4 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-white">
              Schedule A Concept Consultation
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
          </Link>
        </div>
      </section>
    </div>
  );
}
