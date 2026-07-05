import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { fetchProjects } from "../../services/portfolioService";

// Helper to determine cover image with fallback for video projects
const getProjectImage = (project) => {
  if (project.image) return project.image;
  if (project.videoUrl) {
    const ytMatch = project.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
};

export default function Portfolio() {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Residential", "Commercial", "Renovation"];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProjects();
        setProjectsList(data);
      } catch (err) {
        console.error("Failed to load portfolio items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projectsList
      : projectsList.filter((project) => project.category === activeCategory);

  // Premium Shimmer Loader Skeleton
  const ShimmerSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex flex-col space-y-4 animate-pulse">
          <div className="aspect-[3/2] bg-stone-100 border border-stone-200/40" />
          <div className="flex justify-between items-start pt-2">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-stone-150 w-2/3" />
              <div className="h-3 bg-stone-100 w-1/4 mt-2" />
            </div>
            <div className="h-4 bg-stone-100 w-1/5" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative">
      {/* Intro Page Title Banner */}
      <section className="bg-stone-950 pt-36 pb-24 md:pt-44 md:pb-32 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80')` }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-3">Our Work</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide uppercase">Design Portfolio</h1>
          <div className="w-16 h-[1px] bg-studio-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Filterable Portfolio Grid Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Categories Tab Selector */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-16 border-b border-stone-200 pb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-sans text-xs tracking-widest uppercase transition-luxury py-2 px-4 relative focus:outline-none ${
                  activeCategory === category
                    ? "text-studio-accent font-semibold"
                    : "text-stone-400 hover:text-stone-900"
                }`}
              >
                {category}
                {activeCategory === category && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-studio-accent animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Grid Layout or Shimmer Loading */}
          {loading ? (
            <ShimmerSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map((project, idx) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group flex flex-col space-y-4"
                  data-aos="fade-up"
                  data-aos-delay={(idx % 3) * 150}
                >
                  {/* Image Frame with Overlays */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-stone-950 shadow-lg">
                    <img
                      src={getProjectImage(project)}
                      alt={project.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-luxury duration-700 brightness-[0.95]"
                    />
                    
                    {/* Video Play Indicator Badge */}
                    {project.videoUrl && (
                      <div className="absolute top-4 right-4 bg-stone-950/85 backdrop-blur-md text-studio-accent p-2.5 rounded-full border border-studio-accent/20 z-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Play size={12} className="fill-studio-accent" />
                      </div>
                    )}
                    {/* Subtle Elegant Hover Overlay */}
                    <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[2px] flex flex-col justify-between p-8 opacity-0 group-hover:opacity-100 transition-luxury duration-500">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-studio-accent font-medium">
                        {project.category}
                      </span>
                      <div className="flex flex-col space-y-2">
                        <h4 className="text-white font-serif text-2xl leading-tight">
                          {project.title}
                        </h4>
                        <p className="text-stone-400 text-xs font-light leading-relaxed line-clamp-2">
                          {project.shortDesc}
                        </p>
                      </div>
                      <span className="text-white text-[10px] tracking-widest uppercase border-b border-white/40 pb-1 self-start group-hover:border-studio-accent transition-colors duration-300">
                        View Project Detail
                      </span>
                    </div>
                  </div>
                  {/* Metadata */}
                  <div className="flex justify-between items-start pt-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-serif text-stone-900 group-hover:text-studio-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">
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

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20 text-stone-400">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
