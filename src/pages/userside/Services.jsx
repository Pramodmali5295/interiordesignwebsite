import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home as HomeIcon, Briefcase, LayoutGrid, Compass, Hammer, Layers, ArrowRight } from "lucide-react";
import { fetchServices } from "../../services/serviceService";

export default function Services() {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServicesData() {
      try {
        const data = await fetchServices();
        setServicesList(data);
      } catch (err) {
        console.error("Error loading services database content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadServicesData();
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Home":
        return <HomeIcon className="stroke-[1px]" size={42} />;
      case "Briefcase":
        return <Briefcase className="stroke-[1px]" size={42} />;
      case "LayoutGrid":
        return <LayoutGrid className="stroke-[1px]" size={42} />;
      case "Compass":
        return <Compass className="stroke-[1px]" size={42} />;
      case "Hammer":
        return <Hammer className="stroke-[1px]" size={42} />;
      case "Layers":
        return <Layers className="stroke-[1px]" size={42} />;
      default:
        return <Compass className="stroke-[1px]" size={42} />;
    }
  };

  return (
    <div className="relative">
      {/* Intro Page Title Banner */}
      <section className="bg-stone-950 pt-36 pb-24 md:pt-44 md:pb-32 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80')` }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-3">Our Offerings</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide uppercase">Studio Services</h1>
          <div className="w-16 h-[1px] bg-studio-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">Design Expertise</span>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 font-light leading-snug">
              Every detail considered.<br />Every space customized.
            </h2>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed mt-6">
              Our studio provides a complete turnkey experience. From initial feasibility layouts to curated lighting systems and bespoke carpentry, we bring absolute spatial harmony to your environment.
            </p>
          </div>

          {loading ? (
            <div className="space-y-24 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  <div className="w-full lg:w-1/2 aspect-[3/2] bg-stone-100 rounded" />
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="h-6 bg-stone-100 w-12 rounded" />
                    <div className="h-8 bg-stone-100 w-2/3 rounded" />
                    <div className="h-4 bg-stone-100 w-full rounded" />
                    <div className="h-4 bg-stone-100 w-4/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-24">
              {servicesList.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={service.id}
                    className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                    data-aos="fade-up"
                    data-aos-duration="800"
                  >
                    {/* Service Image Frame */}
                    <div className="w-full lg:w-1/2">
                      <div className="aspect-[3/2] overflow-hidden bg-stone-950 relative shadow-2xl">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="object-cover w-full h-full transform hover:scale-105 transition-luxury duration-700 brightness-95"
                        />
                      </div>
                    </div>

                    {/* Service Text Context */}
                    <div className="w-full lg:w-1/2 flex flex-col space-y-6">
                      <div className="text-studio-accent">
                        {getIcon(service.icon)}
                      </div>
                      <h3 className="text-3xl font-serif text-stone-900 font-light">
                        {service.title}
                      </h3>
                      <p className="text-stone-600 font-light leading-relaxed text-sm md:text-base">
                        {service.longDesc || service.shortDesc}
                      </p>
                      <div className="gold-divider w-24"></div>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Turnkey Solution / Curated Delivery
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-stone-950 py-24 text-center border-t border-stone-900">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-4">Commence Your Project</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light uppercase tracking-wider mb-8">
            Let's Shape Your Vision
          </h2>
          <p className="text-stone-400 font-light leading-relaxed max-w-xl mb-10 text-xs md:text-sm">
            Interested in learning how we would approach your space? Get in touch with our design studio to set up an introductory consultation.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 border border-studio-accent text-studio-accent px-8 py-3 text-xs tracking-widest uppercase hover:bg-studio-accent hover:text-stone-900 transition-luxury duration-500 font-semibold"
          >
            Connect With The Studio
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}
