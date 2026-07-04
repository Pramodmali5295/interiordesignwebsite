import { useState, useEffect } from "react";
import { fetchTestimonials } from "../../services/testimonialService";

export default function Testimonials() {
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonialsData() {
      try {
        const data = await fetchTestimonials();
        setTestimonialsList(data);
      } catch (err) {
        console.error("Error loading testimonials database content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonialsData();
  }, []);

  return (
    <div className="relative">
      {/* Intro Page Title Banner */}
      <section className="bg-stone-950 pt-36 pb-24 md:pt-44 md:pb-32 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=80')` }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-3">Client Stories</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide uppercase">Testimonials</h1>
          <div className="w-16 h-[1px] bg-studio-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Grid of Reviews */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">Complete Journal</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light">Additional Reflections</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-stone-200 p-8 space-y-4">
                  <div className="h-4 bg-stone-100 w-full rounded" />
                  <div className="h-4 bg-stone-100 w-5/6 rounded" />
                  <div className="h-4 bg-stone-100 w-4/5 rounded" />
                  <div className="border-t border-stone-100 pt-4 flex justify-end">
                    <div className="space-y-2 flex flex-col items-end">
                      <div className="h-4 bg-stone-200 w-24 rounded" />
                      <div className="h-3 bg-stone-100 w-16 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialsList.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 p-8 hover:border-studio-accent transition-luxury group flex flex-col justify-between"
                  data-aos="fade-up"
                  data-aos-delay={(idx % 3) * 100}
                >
                  <div className="flex-grow flex flex-col justify-between">
                    <p className="text-stone-600 font-light text-sm leading-relaxed italic mb-8">
                      “{item.text}”
                    </p>
                    <div className="border-t border-stone-100 pt-4 flex justify-end text-right">
                      <div>
                        <h4 className="font-sans text-xs font-semibold text-stone-900 uppercase tracking-wider">
                          — {item.name}
                        </h4>
                        <span className="text-[9px] uppercase tracking-widest text-stone-400 block mt-0.5">
                          {item.company}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
