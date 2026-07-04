import { useState, useEffect } from "react";
import StatsCounter from "../../components/StatsCounter";
import { fetchStats, fetchTimeline, fetchAboutContent } from "../../services/aboutService";

export default function About() {
  const [statsList, setStatsList] = useState([]);
  const [timelineList, setTimelineList] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [statsData, timelineData, contentData] = await Promise.all([
          fetchStats(),
          fetchTimeline(),
          fetchAboutContent()
        ]);
        setStatsList(statsData);
        setTimelineList(timelineData);
        setAboutContent(contentData);
      } catch (err) {
        console.error("Failed to load about page database content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAboutData();
  }, []);

  return (
    <div className="relative">
      {/* Intro Page Title Banner */}
      <section className="bg-stone-950 pt-36 pb-24 md:pt-44 md:pb-32 text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${aboutContent?.heroBannerImage || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1920&q=80"}')` }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-3">{aboutContent?.heroSubtitle || "Learn About Us"}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide uppercase">{aboutContent?.heroTitle || "The Studio"}</h1>
          <div className="w-16 h-[1px] bg-studio-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">{aboutContent?.storySubtitle || "Our Narrative"}</span>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 leading-snug mb-8 font-light">
              {aboutContent?.storyTitle || "Crafting Silent Luxury & Functional Serenity"}
            </h2>
            <p className="text-stone-600 font-light leading-relaxed mb-6 whitespace-pre-wrap">
              {aboutContent?.storyParagraph1 || "Founded in 2011, AURA Design Studio was born from a desire to strip away the noise of modern design and replace it with quiet elegance. We believe premium spaces should not scream for attention; instead, they should serve as serene backdrops for the lives lived within them."}
            </p>
            <p className="text-stone-600 font-light leading-relaxed whitespace-pre-wrap">
              {aboutContent?.storyParagraph2 || "Based in New York but serving clients globally, our multidisciplinary team of architects, interior curators, and project managers oversee commissions from initial sketches through structural engineering to final styling. We balance organic materials with clean spatial plans, crafting custom homes and commercial destinations that resonate with high-end luxury."}
            </p>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative shadow-2xl">
              <img
                src={aboutContent?.storyImage || "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=80"}
                alt="Studio interior"
                className="object-cover w-full h-full brightness-95"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-stone-900 text-white p-8 hidden md:block border border-studio-accent/30 max-w-xs">
              <p className="font-serif text-lg text-studio-accent italic">{aboutContent?.storyQuote || "“Simplicity is the ultimate expression of complex design.”"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-stone-950 text-white py-20 border-t border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col items-center space-y-2">
                  <div className="h-10 bg-stone-850 w-24 rounded" />
                  <div className="h-4 bg-stone-850 w-32 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {statsList.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-4xl md:text-6xl text-studio-accent font-serif tracking-tight font-light mb-2">
                    <StatsCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-light">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-studio-light">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5" data-aos="fade-right">
            <div className="aspect-[4/5] bg-stone-200 overflow-hidden relative shadow-xl">
              <img
                src={aboutContent?.founderImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=1000&q=80"}
                alt="Founder"
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
          <div className="lg:col-span-7" data-aos="fade-left">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">{aboutContent?.founderSubtitle || "Founder & Creative Director"}</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 font-light mb-2">{aboutContent?.founderName || "Evelyn Vance"}</h2>
            <span className="text-xs uppercase tracking-widest text-studio-accent font-medium block mb-8">{aboutContent?.founderTitle || "AIA, ASID Registered Architect"}</span>
            <div className="w-12 h-[1px] bg-studio-accent mb-8"></div>
            <p className="text-stone-600 font-light leading-relaxed mb-6 whitespace-pre-wrap">
              {aboutContent?.founderParagraph1 || "With over fifteen years of architecture experience in London and New York, Evelyn Vance leads AURA with a distinct focus on natural textures and structural geometry. Her philosophy revolves around the tactile relationship between humans and materials."}
            </p>
            <p className="text-stone-600 font-light leading-relaxed mb-8 whitespace-pre-wrap">
              {aboutContent?.founderParagraph2 || "“An interior shouldn't compete with the architectural envelope or the scenery outside. Our goal is to synthesize stone, wood, light, and fabric in a way that feels organic and inevitable. We create the frame, and let our clients' lives serve as the painting.”"}
            </p>
            <div className="border-t border-stone-200 pt-6">
              <span className="font-serif text-stone-900 tracking-wider font-light italic">{aboutContent?.founderName || "Evelyn Vance"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Design Process Timeline */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-4">{aboutContent?.timelineSubtitle || "How We Work"}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 font-light">{aboutContent?.timelineTitle || "The Creative Process"}</h2>
            <div className="w-16 h-[1px] bg-studio-accent mx-auto mt-6"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100" />
                  <div className="h-5 bg-stone-200 w-2/3 rounded" />
                  <div className="h-10 bg-stone-100 w-full rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {/* Horizontal Timeline Line for Desktop */}
              <div className="absolute top-[35px] left-8 right-8 h-[1px] bg-stone-200 hidden md:block z-0" />
              
              {timelineList.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left" data-aos="fade-up" data-aos-delay={idx * 100}>
                  {/* Number Badge */}
                  <div className="w-16 h-16 rounded-full bg-studio-accent text-stone-950 flex items-center justify-center font-serif text-lg mb-6 shadow-lg border border-studio-accent hover:bg-stone-900 hover:text-white hover:border-stone-900 hover:scale-110 transition-all duration-300">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-stone-500 font-light text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
